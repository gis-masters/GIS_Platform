package ru.mycrg.gis_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectUpdateDto;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.entity.BaseMap;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.entity.Role;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.BaseMapRepository;
import ru.mycrg.gis_service.repository.PermissionRepository;
import ru.mycrg.gis_service.repository.ProjectRepository;
import ru.mycrg.gis_service.repository.RoleRepository;

import java.util.List;
import java.util.Objects;
import java.util.Set;

import static java.time.LocalDateTime.now;
import static java.util.Objects.nonNull;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.security.Roles.OWNER;

@Service
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectProjectionFactory projectionFactory;
    private final ProjectRepository projectRepository;
    private final PermissionRepository permissionRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;
    private final BaseMapRepository baseMapRepository;
    private final DataServiceBasemapsClient dataServiceBasemapsClient;
    private final RoleRepository roleRepository;

    public ProjectService(ProjectProjectionFactory projectionFactory,
                          ProjectRepository projectRepository,
                          PermissionRepository permissionRepository,
                          IAuthenticationFacade authenticationFacade,
                          MessageBusProducer messageBus,
                          BaseMapRepository baseMapRepository,
                          DataServiceBasemapsClient dataServiceBasemapsClient,
                          RoleRepository roleRepository) {
        this.projectionFactory = projectionFactory;
        this.projectRepository = projectRepository;
        this.permissionRepository = permissionRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
        this.baseMapRepository = baseMapRepository;
        this.dataServiceBasemapsClient = dataServiceBasemapsClient;
        this.roleRepository = roleRepository;
    }

    /**
     * Получает страницу проектов с фильтрацией по имени и родительской папке
     *
     * @param parentFolderId идентификатор родительской папки (null для корневого уровня)
     * @param name           фильтр по имени проекта
     * @param pageable       параметры пагинации
     *
     * @return страница проекций проектов
     */
    public Page<ProjectProjection> getPaged(Long parentFolderId, String name, Pageable pageable) {
        Long orgId = authenticationFacade.getOrganizationId();

        if (parentFolderId == null) {
            return projectRepository.findAllByRoot(orgId, name, pageable)
                                    .map(projectionFactory::setRoleAndCreateProjection);
        } else {
            // Проверяем, что родительский проект существует и является папкой
            Project parentProject = getById(parentFolderId);
            if (!parentProject.isFolder()) {
                throw new BadRequestException("Указанный проект не является папкой: " + parentFolderId);
            }

            return projectRepository.findAllByPath(orgId, name, "/" + parentFolderId, pageable)
                                    .map(projectionFactory::setRoleAndCreateProjection);
        }
    }

    public List<Project> getAll() {
        Long orgId = authenticationFacade.getOrganizationId();

        return projectRepository.findAllByOrganizationId(orgId);
    }

    /**
     * Retrieves an entity by their id.
     *
     * @param id must not be null
     *
     * @return the entity with the given id.
     *
     * @throws NotFoundException if entity not exist or user not have permissions.
     */
    @NotNull
    public Project getById(@NotNull Long id) {
        if (authenticationFacade.isRoot()) {
            return projectRepository
                    .findById(id)
                    .orElseThrow(() -> new NotFoundException(Project.class, id));
        }

        Long orgId = authenticationFacade.getOrganizationId();
        Project project = projectRepository
                .findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new NotFoundException(Project.class, id));

        if (authenticationFacade.isOrganizationAdmin()) {
            return project;
        }

        UserDetails userDetails = authenticationFacade.getUserDetails();
        if (isAllowedForUser(project, userDetails)) {
            return project;
        } else {
            throw new ForbiddenException("Недостаточно прав для просмотра проекта: " + id);
        }
    }

    public ProjectProjection getProjectionById(Long id) {
        Project project = getById(id);

        return projectionFactory.setRoleAndCreateProjection(project);
    }

    public ProjectProjection getProjectionByIdUnsafe(Long id) {
        final Project project = projectRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(Project.class, id));

        return projectionFactory.setRoleAndCreateProjection(project);
    }

    @Transactional
    public void update(long projectId, ProjectUpdateDto updateDto) {
        Project project;
        if (authenticationFacade.isRoot()) {
            project = projectRepository
                    .findById(projectId)
                    .orElseThrow(() -> new NotFoundException(projectId));
        } else {
            project = getById(projectId);
            if (!isOwner(project)) {
                throw new ForbiddenException("Недостаточно прав для редактирования проекта: " + projectId);
            }
        }

        if (nonNull(updateDto.getName()) && !updateDto.getName().isEmpty()) {
            project.setName(updateDto.getName());
        }
        if (nonNull(updateDto.getDescription()) && !updateDto.getDescription().isEmpty()) {
            project.setDescription(updateDto.getDescription());
        }
        if (nonNull(updateDto.getBbox())) {
            project.setBbox(updateDto.getBbox());
        }

        project.setLastModified(now());

        projectRepository.save(project);

        sendAuditEvent("UPDATE", project);
    }

    @Transactional
    public ProjectProjection create(ProjectCreateDto dto) {
        Long orgId = authenticationFacade.getOrganizationId();
        Long userId = authenticationFacade.getUserDetails().getUserId();

        log.info("Init create project/folder: {} for organization: {}", dto, orgId);

        Project project = new Project(dto, orgId);

        // Если указана родительская папка, устанавливаем путь
        project.setPath(getPathForParent(dto.getParentId()));

        Project savedProject = projectRepository.save(project);

        Role role = roleRepository.findByNameIgnoreCase(OWNER.name())
                                  .orElseThrow(() -> new NotFoundException("Не найдена роль: " + OWNER.name()));

        permissionRepository.save(new Permission("user", userId, role, savedProject));

        // Добавляем базовые карты только для проектов, не для папок
        if (!dto.isFolder()) {
            plugInBaseMapToNewProject(savedProject);
        }

        // Отправляем событие аудита
        sendAuditEvent("CREATE", savedProject);

        ProjectProjectionImpl projection = new ProjectProjectionImpl(savedProject);
        projection.setRole(OWNER.name());

        return projection;
    }

    /**
     * Перемещает проект в другую папку
     *
     * @param projectId      идентификатор проекта для перемещения
     * @param parentFolderId идентификатор родительской папки (может быть null для перемещения на корневой уровень)
     */
    @Transactional
    public void moveProject(long projectId, Long parentFolderId) {
        Project project = getById(projectId);

        if (!isOwner(project)) {
            throw new ForbiddenException("Недостаточно прав для перемещения проекта: " + projectId);
        }

        project.setPath(getPathForParent(parentFolderId));

        project.setLastModified(now());
        projectRepository.save(project);

        sendAuditEvent("MOVE", project);
    }

    /**
     * Удаляет проект или папку
     *
     * @param projectId идентификатор проекта или папки
     *
     * @throws BadRequestException если папка не пуста
     * @throws ForbiddenException  если у пользователя недостаточно прав
     */
    public void delete(Long projectId) {
        Project project = getById(projectId);
        if (!isOwner(project)) {
            throw new ForbiddenException("Недостаточно прав для удаления проекта: " + projectId);
        }

        // Если это папка, проверяем, что она пуста
        if (project.isFolder() && projectRepository.existsByPath(projectId)) {
            throw new BadRequestException(
                    "Невозможно удалить непустую папку. Пожалуйста, сначала удалите всё содержимое");
        }

        projectRepository.delete(project);

        sendDeleteAuditEvent(project);
    }

    private void plugInBaseMapToNewProject(Project project) {
        dataServiceBasemapsClient.getAllPluggable()
                                 .forEach(dto -> {
                                     BaseMap baseMap = new BaseMap(dto);

                                     baseMapRepository.save(baseMap);

                                     project.addBaseMap(baseMap);
                                 });
    }

    private boolean isOwner(Project project) {
        if (authenticationFacade.isOrganizationAdmin()) {
            return true;
        }

        Long userId = authenticationFacade.getUserDetails().getUserId();
        List<Long> groupIds = authenticationFacade.getUserDetails().getGroups();

        return project
                .getPermissions().stream()
                .filter(permission -> isUserPermission(userId, permission) || isGroupPermission(groupIds, permission))
                .anyMatch(permission -> permission.getRole().getName().equals(OWNER.name()));
    }

    private boolean isGroupPermission(List<Long> groupIds, Permission permission) {
        if ("group".equals(permission.getPrincipalType())) {
            return groupIds.contains(permission.getPrincipalId());
        }

        return false;
    }

    private static boolean isUserPermission(Long userId, Permission permission) {
        return "user".equals(permission.getPrincipalType()) && Objects.equals(permission.getPrincipalId(), userId);
    }

    private boolean isAllowedForUser(Project project, UserDetails userDetails) {
        Long userId = userDetails.getUserId();
        List<Long> groupsIds = userDetails.getGroups();

        // Нужно просмотреть все разрешения проекта, там должны быть какие-то касательно пользователя или его группы,
        // если таковых нет - то доступа нет!
        Set<Permission> permissions = project.getPermissions();
        boolean isExist = false;
        for (Permission permission: permissions) {
            if (permission.getPrincipalType().equals("user")) {
                if (permission.getPrincipalId().equals(userId)) {
                    isExist = true;
                }
            } else if (permission.getPrincipalType().equals("group")) {
                if (groupsIds.contains(permission.getPrincipalId())) {
                    isExist = true;
                }
            }
        }

        return isExist;
    }

    /**
     * Получает путь для родительской папки
     *
     * @param parentId идентификатор родительской папки
     *
     * @return путь для родительской папки
     *
     * @throws BadRequestException если указанный проект не является папкой
     */
    private String getPathForParent(Long parentId) {
        if (parentId == null || parentId == 0) {
            return null;
        }

        Project parentFolder = getById(parentId);
        if (!parentFolder.isFolder()) {
            throw new BadRequestException("Указанный проект не является папкой: " + parentId);
        }

        String folderPath = parentFolder.getPath();
        if (folderPath == null) {
            return "/" + parentFolder.getId();
        } else {
            return folderPath + "/" + parentFolder.getId();
        }
    }

    private void sendAuditEvent(String action, Project project) {
        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  action,
                                  project.getName(),
                                  project.isFolder() ? "FOLDER" : "PROJECT",
                                  project.getId(),
                                  objectMapper.convertValue(project, JsonNode.class)));
    }

    private void sendDeleteAuditEvent(Project project) {
        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "DELETE",
                                  project.getName(),
                                  project.isFolder() ? "FOLDER" : "PROJECT",
                                  project.getId()));
    }
}
