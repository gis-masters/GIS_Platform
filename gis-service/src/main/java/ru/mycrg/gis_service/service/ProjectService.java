package ru.mycrg.gis_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import events.CrgAuditEvent;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.PermissionCreateDto;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.dto.ProjectRequestDto;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.PermissionRepository;
import ru.mycrg.gis_service.repository.ProjectRepository;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.gis_service.security.UserDetails;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static dto.AuditEventActionsType.*;
import static dto.AuditEventEntityType.PROJECT;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultProjectName;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.security.Roles.OWNER;

@Service
@Transactional
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectProjectionFactory projectionFactory;
    private final ProjectRepository projectRepository;
    private final PermissionRepository permissionRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;

    public ProjectService(ProjectProjectionFactory projectionFactory,
                          ProjectRepository projectRepository,
                          PermissionRepository permissionRepository,
                          IAuthenticationFacade authenticationFacade,
                          MessageBusProducer messageBus) {
        this.projectionFactory = projectionFactory;
        this.projectRepository = projectRepository;
        this.permissionRepository = permissionRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
    }

    public Page<ProjectProjection> getPaged(String name, Pageable pageable) {
        Page<Project> projects;
        if (authenticationFacade.isRoot()) {
            projects = projectRepository.findAllByNameContainingIgnoreCase(name, pageable);
        } else {
            final UserDetails userDetails = authenticationFacade.getUserDetails();
            Long orgId = authenticationFacade.getOrganizationId();
            if (authenticationFacade.isOrganizationAdmin()) {
                projects = projectRepository.findAllByOrganizationIdAndNameContainingIgnoreCase(orgId, name, pageable);
            } else {
                final List<Project> organizationProjects = projectRepository
                        .findAllByOrganizationIdAndNameContainingIgnoreCase(orgId, name, pageable).stream()
                        .collect(Collectors.toList());
                final List<Project> filteredProjects = filterByPermissions(organizationProjects, userDetails);

                projects = new PageImpl<>(filteredProjects, pageable, filteredProjects.size());
            }
        }

        return projects.map(projectionFactory::createProjection);
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
        final UserDetails userDetails = authenticationFacade.getUserDetails();

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

        final List<Project> filteredProjects = filterByPermissions(Collections.singletonList(project), userDetails);
        if (!filteredProjects.isEmpty()) {
            return project;
        } else {
            throw new ForbiddenException("Not allowed");
        }
    }

    public ProjectProjection getProjectionById(Long id) {
        return projectionFactory.createProjection(getById(id));
    }

    public ProjectProjection getProjectionByIdUnsafe(Long id) {
        final Project project = projectRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(Project.class, id));

        return projectionFactory.createProjection(project);
    }

    /**
     * Обновление проекта. До тех пор пока меняется только название проекта, можно менять только алиас в нашей БД. Не
     * меняя названия рабочей области на геосервере и схемы в БД.
     *
     * @param projectId   Идентификатор проекта.
     * @param projectName Новое название проекта.
     */
    public void update(long projectId, String projectName) {
        Project project;
        if (authenticationFacade.isRoot()) {
            project = projectRepository
                    .findById(projectId)
                    .orElseThrow(() -> new NotFoundException(projectId));
        } else {
            project = getById(projectId);
            if (!isOwner(project)) {
                throw new ForbiddenException("Not Allowed");
            }
        }

        project.setName(projectName);
        project.setLastModified(LocalDateTime.now());

        projectRepository.save(project);

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             UPDATE,
                                             projectName,
                                             PROJECT,
                                             project.getId(),
                                             objectMapper.convertValue(project, JsonNode.class)));
    }

    public ProjectProjection create(ProjectRequestDto dto) {
        final Long orgId = authenticationFacade.getOrganizationId();
        final Long userId = authenticationFacade.getUserDetails().getUserId();

        log.info("Init create project: {} for organization: {}", dto.getProjectName(), orgId);

        Optional<Project> projectWithSameName =
                projectRepository.findByNameAndOrganizationId(dto.getProjectName(), orgId);
        if (projectWithSameName.isPresent()) {
            throw new ConflictException("Проект с таким именем уже существует");
        }

        Project newProject = new Project(dto.getProjectName(), orgId);
        Project savedProject = projectRepository.save(newProject);

        savedProject.setInternalName(getDefaultProjectName(savedProject.getId()));

        projectRepository.save(savedProject);
        permissionRepository.save(new Permission(new PermissionCreateDto(userId, "user", OWNER.name()), savedProject));

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             CREATE,
                                             savedProject.getName(),
                                             PROJECT,
                                             savedProject.getId(),
                                             objectMapper.convertValue(savedProject, JsonNode.class)));

        return projectionFactory.createProjection(savedProject);
    }

    public void delete(Long projectId) {
        Project project = getById(projectId);
        if (isOwner(project)) {
            projectRepository.delete(project);
            messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                                 DELETE,
                                                 project.getName(),
                                                 PROJECT,
                                                 projectId));
        } else {
            throw new ForbiddenException("Not Allowed");
        }
    }

    private boolean isOwner(Project project) {
        if (authenticationFacade.isOrganizationAdmin()) {
            return true;
        }

        final Long userId = authenticationFacade.getUserDetails().getUserId();

        return project.getPermissions().stream()
                      .filter(permission -> Objects.equals(permission.getPrincipalId(), userId))
                      .anyMatch(permission -> permission.getRole().equals(OWNER.name()));
    }

    private List<Project> filterByPermissions(List<Project> projects, UserDetails userDetails) {
        final Long userId = userDetails.getUserId();
        final List<Long> groupsIds = userDetails.getGroups();

        // Нужно просмотреть все пермишены проекта, там должны быть какието касательно пользователя или его группы,
        // если таковых нет то нет доступа, отфильтровываем
        return projects
                .stream()
                .filter(project -> {
                    final Set<Permission> permissions = project.getPermissions();
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
                })
                .collect(Collectors.toList());
    }
}
