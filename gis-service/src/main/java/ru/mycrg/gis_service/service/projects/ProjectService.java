package ru.mycrg.gis_service.service.projects;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectUpdateDto;
import ru.mycrg.gis_service.dao.ProjectsDao;
import ru.mycrg.gis_service.dto.project.ProjectPermission;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.BaseMap;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.entity.Role;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.BaseMapRepository;
import ru.mycrg.gis_service.repository.PermissionRepository;
import ru.mycrg.gis_service.repository.ProjectRepository;
import ru.mycrg.gis_service.repository.RoleRepository;
import ru.mycrg.gis_service.security.Roles;
import ru.mycrg.gis_service.service.DataServiceBasemapsClient;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static java.util.Objects.nonNull;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.mappers.ProjectMapper.toProjection;
import static ru.mycrg.gis_service.security.Roles.*;

@Service
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;
    private final PermissionRepository permissionRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;
    private final BaseMapRepository baseMapRepository;
    private final DataServiceBasemapsClient dataServiceBasemapsClient;
    private final RoleRepository roleRepository;
    private final ProjectsDao projectsDao;

    public ProjectService(ProjectRepository projectRepository,
                          PermissionRepository permissionRepository,
                          IAuthenticationFacade authenticationFacade,
                          MessageBusProducer messageBus,
                          BaseMapRepository baseMapRepository,
                          DataServiceBasemapsClient dataServiceBasemapsClient,
                          RoleRepository roleRepository,
                          ProjectsDao projectsDao) {
        this.projectRepository = projectRepository;
        this.permissionRepository = permissionRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
        this.baseMapRepository = baseMapRepository;
        this.dataServiceBasemapsClient = dataServiceBasemapsClient;
        this.roleRepository = roleRepository;
        this.projectsDao = projectsDao;
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
    public Page<ProjectProjectionImpl> getPaged(Long parentFolderId, String name, Pageable pageable) {
        Long orgId = authenticationFacade.getOrganizationId();

        if (parentFolderId == null) {
            if (authenticationFacade.isOrganizationAdmin()) {
                return projectRepository.findAllByRoot(orgId, name, pageable)
                                        .map(project -> toProjection(project, OWNER));
            } else {
                List<ProjectProjectionImpl> projects = projectsDao.allowedProjectsByRoot(name, pageable);
                Long totalAllowed = projectsDao.totalAllowedProjects(name);

                return new PageImpl<>(projects, pageable, totalAllowed);
            }
        } else {
            // Проверяем, что родительский проект существует и является папкой
            Project parentFolder = projectRepository
                    .findByIdAndOrganizationId(parentFolderId, orgId)
                    .orElseThrow(() -> new NotFoundException(Project.class, parentFolderId));
            if (!parentFolder.isFolder()) {
                throw new BadRequestException("Указанный проект не является папкой: " + parentFolderId);
            }

            if (authenticationFacade.isOrganizationAdmin()) {
                return projectRepository.findAllByPath(orgId, name, "/" + parentFolderId, pageable)
                                        .map(project -> toProjection(project, OWNER));
            }

            String pathToMe = getPathToMe(parentFolder);
            Set<String> parentIds = Arrays.stream(pathToMe.split("/"))
                                          .filter(id -> !id.isBlank())
                                          .collect(Collectors.toSet());

            Long bestRoleFromParents = projectsDao.getBestRoleFromParents(parentIds);
            if (Objects.equals(bestRoleFromParents, 30L)) {
                // Получили OWNER от какого-то родителя. Лучше уже не будет. Проставляем всем OWNER и возвращаем.
                return projectRepository.findAllByPath(orgId, name, "/" + parentFolderId, pageable)
                                        .map(project -> toProjection(project, OWNER));
            } else if (Objects.equals(bestRoleFromParents, 20L)) {
                // Получили CONTRIBUTOR от какого-то родителя. Проставляем всем CONTRIBUTOR.
                Page<ProjectProjectionImpl> byParents = projectRepository
                        .findAllByPath(orgId, name, "/" + parentFolderId, pageable)
                        .map(project -> toProjection(project, CONTRIBUTOR));

                // CONTRIBUTOR не являются лучшей ролью. Пробуем найти права выданные непосредственно на
                // ресурсы лежащие в заданной папке. И заменим если они лучше CONTRIBUTOR.
                Set<String> pIds = byParents.stream()
                                            .map(projectProjection -> projectProjection.getId().toString())
                                            .collect(Collectors.toSet());
                List<ProjectPermission> permissions = projectsDao.getMaxRoleFromDirectlyPermissions(pIds);
                permissions.forEach(pp -> {
                    byParents.stream()
                             .filter(projectProjection -> Objects.equals(projectProjection.getId(), pp.getProjectId()))
                             .findFirst()
                             .ifPresent(p -> {
                                 Roles role = Roles.stringToRole(p.getRole());
                                 if (role.roleToValue() < pp.getMaxRole()) {
                                     p.setRole(Roles.valueToRole(pp.getMaxRole()).name());
                                 }
                             });
                });

                return byParents;
            } else if (Objects.equals(bestRoleFromParents, 10L)) {
                // Получили VIEWER от какого-то родителя. Проставляем всем VIEWER.
                Page<ProjectProjectionImpl> byParents = projectRepository
                        .findAllByPath(orgId, name, "/" + parentFolderId, pageable)
                        .map(project -> toProjection(project, VIEWER));

                // VIEWER не являются лучшей ролью. Пробуем найти права выданные непосредственно на ресурсы лежащие
                // в заданной папке. И заменим если они лучше VIEWER.
                Set<String> pIds = byParents.stream()
                                            .map(projectProjection -> projectProjection.getId().toString())
                                            .collect(Collectors.toSet());
                List<ProjectPermission> permissions = projectsDao.getMaxRoleFromDirectlyPermissions(pIds);
                permissions.forEach(pp -> {
                    byParents.stream()
                             .filter(projectProjection -> Objects.equals(projectProjection.getId(), pp.getProjectId()))
                             .findFirst()
                             .ifPresent(p -> {
                                 Roles role = Roles.stringToRole(p.getRole());
                                 if (role.roleToValue() < pp.getMaxRole()) {
                                     p.setRole(Roles.valueToRole(pp.getMaxRole()).name());
                                 }
                             });
                });

                return byParents;
            } else {
                // Прав от родителей нет.
                // Ищем права выданные непосредственно на ресурсы лежащие в заданной папке и "проходные" папки.
                // Совмещения прав не требуется, возвращаем.

                List<ProjectProjectionImpl> projects = projectsDao.allowedProjects(pathToMe, name, pageable);
                Long totalAllowed = projectsDao.totalAllowedProjects(name);

                return new PageImpl<>(projects, pageable, totalAllowed);
            }
        }
    }

    public List<Project> getAll() {
        Long orgId = authenticationFacade.getOrganizationId();

        return projectRepository.findAllByOrganizationId(orgId);
    }

    public Project getById(@NotNull Long id) {
        ProjectProjectionImpl withRole = getByIdWithRole(id);

        return projectRepository.findById(withRole.getId())
                                .orElseThrow(() -> new NotFoundException(Project.class, withRole.getId()));
    }

    @NotNull
    public ProjectProjectionImpl getByIdWithRole(@NotNull Long id) {
        if (authenticationFacade.isRoot()) {
            return projectRepository.findById(id)
                                    .map(project -> toProjection(project, OWNER))
                                    .orElseThrow(() -> new NotFoundException(Project.class, id));
        }

        Long orgId = authenticationFacade.getOrganizationId();
        Project project = projectRepository
                .findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new NotFoundException(Project.class, id));

        if (authenticationFacade.isOrganizationAdmin()) {
            return toProjection(project, OWNER);
        }

        String pathToMe = getPathToMe(project);
        String path = project.getPath();
        if (path == null) {
            Long bestRoleForMe = projectsDao.getBestRoleFromParents(Set.of(id.toString()));
            if (bestRoleForMe != null) {
                return toProjection(project, Roles.valueToRole(bestRoleForMe));
            } else {
                return getProjectProjection(id, pathToMe);
            }
        } else {
            Set<String> parentIds = Arrays.stream(pathToMe.split("/"))
                                          .filter(item -> !item.isBlank())
                                          .collect(Collectors.toSet());

            Long bestRoleFromParents = projectsDao.getBestRoleFromParents(parentIds);
            if (bestRoleFromParents != null) {
                return toProjection(project, Roles.valueToRole(bestRoleFromParents));
            } else {
                if (isPassThroughFolder(pathToMe)) {
                    return toProjection(project, VIEWER);
                } else {
                    throw new ForbiddenException("Недостаточно прав для просмотра проекта 2: " + id);
                }
            }
        }
    }

    private boolean isPassThroughFolder(String pathToMe) {
        try {
            return projectsDao
                    .allowedProjects(pathToMe, "", Pageable.unpaged())
                    .stream()
                    .findFirst()
                    .isPresent();
        } catch (Exception e) {
            log.error("Не удалось достать проект => {}", e.getMessage(), e);

            return false;
        }
    }

    private ProjectProjectionImpl getProjectProjection(@NotNull Long id, String pathToMe) {
        try {
            return projectsDao
                    .allowedProjects(pathToMe, "", Pageable.unpaged())
                    .stream()
                    .findFirst()
                    .orElseThrow(() -> new ForbiddenException("Недостаточно прав для просмотра проекта: " + id));
        } catch (ForbiddenException e) {
            throw e;
        } catch (Exception e) {
            log.error("Не удалось достать проект => {}", e.getMessage(), e);

            throw new GisServiceException(e.getMessage());
        }
    }

    public ProjectProjection getProjectionByIdUnsafe(Long id) {
        Project project = projectRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(Project.class, id));

        return toProjection(project, OWNER);
    }

    @Transactional
    public void update(long projectId, ProjectUpdateDto updateDto) {
        if (!authenticationFacade.isRoot() || !authenticationFacade.isOrganizationAdmin()) {
            ProjectProjectionImpl projectImpl = getByIdWithRole(projectId);
            if (projectImpl.getRole() == null || projectImpl.getRole().equals(VIEWER.name())) {
                throw new ForbiddenException("Недостаточно прав для редактирования проекта: " + projectId);
            }
        }

        Project project = projectRepository.findById(projectId)
                                           .orElseThrow(() -> new NotFoundException(projectId));

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
    public ProjectProjectionImpl create(ProjectCreateDto dto) {
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
     * Удаляет проект или папку
     *
     * @param projectItemId идентификатор проекта или папки
     * @param forced        удаление вместе со всем содержимым. Разрешено только владельцу организации.
     *
     * @throws BadRequestException если папка не пуста
     * @throws ForbiddenException  если у пользователя недостаточно прав
     */
    @Transactional
    public void delete(Long projectItemId, boolean forced) {
        if (authenticationFacade.isOrganizationAdmin() && forced) {
            log.debug("Удаляем проект/папку со всем содержимым");

            List<Long> ids = projectsDao.getProjectItemIdsFromParent(projectItemId);
            projectRepository.deleteAllByIdIn(ids);
            permissionRepository.deleteAllByProjectIdIn(ids);

            messageBus.produce(
                    new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                      "DELETE", "PROJECT_ITEM", "PROJECT_ITEM", projectItemId));
        } else {
            ProjectProjectionImpl projectImpl = getByIdWithRole(projectItemId);
            if (!projectImpl.getRole().equals(OWNER.name())) {
                throw new ForbiddenException("Недостаточно прав для удаления проекта: " + projectItemId);
            }

            // Если это папка, проверяем, что она пуста
            if (projectImpl.isFolder() && projectRepository.existsByPath(projectItemId)) {
                throw new BadRequestException(
                        "Невозможно удалить непустую папку. Пожалуйста, сначала удалите всё содержимое");
            }

            projectRepository.deleteById(projectItemId);

            messageBus.produce(
                    new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                      "DELETE",
                                      projectImpl.getName(),
                                      projectImpl.isFolder() ? "FOLDER" : "PROJECT",
                                      projectImpl.getId()));
        }
    }

    private void plugInBaseMapToNewProject(Project project) {
        dataServiceBasemapsClient.getAllPluggable()
                                 .forEach(dto -> {
                                     BaseMap baseMap = new BaseMap(dto);

                                     baseMapRepository.save(baseMap);

                                     project.addBaseMap(baseMap);
                                 });
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

        return getPathToMe(parentFolder);
    }

    private String getPathToMe(Project folder) {
        String folderPath = folder.getPath();
        if (folderPath == null) {
            return "/" + folder.getId();
        } else {
            return folderPath + "/" + folder.getId();
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
}
