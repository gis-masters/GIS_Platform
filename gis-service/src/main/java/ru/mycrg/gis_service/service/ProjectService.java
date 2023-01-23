package ru.mycrg.gis_service.service;

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
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.gis_service.dao.ProjectsDao;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.dto.ProjectRequestDto;
import ru.mycrg.gis_service.dto.ProjectUpdateDto;
import ru.mycrg.gis_service.entity.BaseMap;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.entity.Role;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.BaseMapRepository;
import ru.mycrg.gis_service.repository.PermissionRepository;
import ru.mycrg.gis_service.repository.ProjectRepository;
import ru.mycrg.gis_service.repository.RoleRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static java.util.Objects.nonNull;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.security.Roles.OWNER;

@Service
@Transactional
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectProjectionFactory projectionFactory;
    private final ProjectRepository projectRepository;
    private final PermissionRepository permissionRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;
    private final ProjectsDao projectsDao;
    private final BaseMapRepository baseMapRepository;
    private final DataServiceBasemapsClient dataServiceBasemapsClient;
    private final RoleRepository roleRepository;

    public ProjectService(ProjectProjectionFactory projectionFactory,
                          ProjectRepository projectRepository,
                          PermissionRepository permissionRepository,
                          IAuthenticationFacade authenticationFacade,
                          MessageBusProducer messageBus,
                          ProjectsDao projectsDao,
                          BaseMapRepository baseMapRepository,
                          DataServiceBasemapsClient dataServiceBasemapsClient,
                          RoleRepository roleRepository) {
        this.projectionFactory = projectionFactory;
        this.projectRepository = projectRepository;
        this.permissionRepository = permissionRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
        this.projectsDao = projectsDao;
        this.baseMapRepository = baseMapRepository;
        this.dataServiceBasemapsClient = dataServiceBasemapsClient;
        this.roleRepository = roleRepository;
    }

    public Page<ProjectProjection> getPaged(String name, Pageable pageable) {
        if (authenticationFacade.isOrganizationAdmin()) {
            Long orgId = authenticationFacade.getOrganizationId();

            return projectRepository
                    .findAllByOrganizationIdAndNameContainingIgnoreCase(orgId, name, pageable)
                    .map(projectionFactory::setRoleAndCreateProjection);
        } else {
            List<ProjectProjection> projects = projectsDao.allowedProjects(name, pageable);
            Long totalAllowed = projectsDao.totalAllowedProjects(name);

            return new PageImpl<>(projects, pageable, totalAllowed);
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

    /**
     * Обновление проекта. До тех пор пока меняется только название проекта, можно менять только алиас в нашей БД. Не
     * меняя названия рабочей области на геосервере и схемы в БД.
     *
     * @param projectId Идентификатор проекта.
     * @param updateDto Сущность для обновления проекта.
     */
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
        if (nonNull(updateDto.getBbox()) && !updateDto.getBbox().isEmpty()) {
            project.setBbox(updateDto.getBbox());
        }

        project.setLastModified(LocalDateTime.now());

        projectRepository.save(project);

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             "UPDATE",
                                             project.getName(),
                                             "PROJECT",
                                             project.getId(),
                                             objectMapper.convertValue(project, JsonNode.class)));
    }

    public ProjectProjection create(ProjectRequestDto dto) {
        final Long orgId = authenticationFacade.getOrganizationId();
        final Long userId = authenticationFacade.getUserDetails().getUserId();

        log.info("Init create project: {} for organization: {}", dto.getProjectName(), orgId);

        Project newProject = new Project(dto.getProjectName(), orgId);
        Project savedProject = projectRepository.save(newProject);

        Role role = roleRepository.findByNameIgnoreCase(OWNER.name())
                                  .orElseThrow(() -> new NotFoundException("Не найдена роль: " + OWNER.name()));

        projectRepository.save(savedProject);
        permissionRepository.save(new Permission("user", userId, role, savedProject));

        plugInBaseMapToNewProject(savedProject);

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             "CREATE",
                                             savedProject.getName(),
                                             "PROJECT",
                                             savedProject.getId(),
                                             objectMapper.convertValue(savedProject, JsonNode.class)));

        return projectionFactory.setRoleAndCreateProjection(savedProject);
    }

    public void delete(Long projectId) {
        Project project = getById(projectId);
        if (!isOwner(project)) {
            throw new ForbiddenException("Недостаточно прав для удаления проекта: " + projectId);
        }

        projectRepository.delete(project);

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "DELETE",
                                  project.getName(),
                                  "PROJECT",
                                  projectId));
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
}
