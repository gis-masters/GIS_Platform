package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.projects.GeoserverProjectService;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.dto.ProjectRequestDto;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.repository.ProjectRepository;
import ru.mycrg.gis_service.security.UserDetails;
import ru.mycrg.oauth_client.OAuthClient;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.security.CrgAuthHelper.getToken;
import static ru.mycrg.gis_service.security.CrgClaimsParser.*;

@Service
@Transactional
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final OAuthClient oAuthClient;
    private final Environment environment;
    private final ProjectionFactory factory;
    private final ProjectRepository projectRepository;

    public static final String DEFAULT_PROJECT_NAME = "workspace";

    public ProjectService(ProjectionFactory factory,
                          Environment environment,
                          ProjectRepository projectRepository,
                          OAuthClient oAuthClient) {
        this.factory = factory;
        this.oAuthClient = oAuthClient;
        this.environment = environment;
        this.projectRepository = projectRepository;
    }

    public Page<ProjectProjection> getAll(Pageable pageable, Authentication authentication) {
        Page<Project> projects;
        if (isRoot(authentication)) {
            projects = projectRepository.findAll(pageable);
        } else {
            final UserDetails userDetails = getUserDetails(authentication);
            Long orgId = getFirstOrganizationId(userDetails);
            if (isOrganizationAdmin(authentication)) {
                projects = projectRepository.findAllByOrganizationId(orgId, pageable);
            } else {
                final List<Project> organizationProjects = projectRepository
                        .findAllByOrganizationId(orgId, pageable).stream()
                        .collect(Collectors.toList());
                final List<Project> filteredProjects = filterByPermissions(organizationProjects, userDetails);

                projects = new PageImpl<>(filteredProjects, pageable, filteredProjects.size());
            }
        }

        return projects.map(project -> factory.createProjection(ProjectProjection.class, project));
    }

    /**
     * Retrieves an entity by their id.
     *
     * @param id             must not be null
     * @param authentication Authenticated principal info, must not be null
     * @return the entity with the given id.
     * @throws NotFoundException if entity not exist or user not have permissions.
     */
    @NotNull
    public Project getById(@NotNull Long id, @NotNull Authentication authentication) {
        final UserDetails userDetails = getUserDetails(authentication);

        if (isRoot(authentication)) {
            return projectRepository
                    .findById(id)
                    .orElseThrow(() -> new NotFoundException(id));
        }

        Long orgId = getFirstOrganizationId(userDetails);
        Project project = projectRepository
                .findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new NotFoundException(id));

        if (isOrganizationAdmin(authentication)) {
            return project;
        }

        final List<Project> filteredProjects = filterByPermissions(Collections.singletonList(project), userDetails);
        if (!filteredProjects.isEmpty()) {
            return project;
        } else {
            throw new ForbiddenException("Not allowed");
        }
    }

    public ProjectProjection getProjectionById(Long id, Authentication authentication) {
        return factory.createProjection(ProjectProjection.class, getById(id, authentication));
    }

    /**
     * Обновление проекта.
     * До тех пор пока меняется только название проекта, можно менять только алиас в нашей БД. Не меняя названия
     * рабочей области на геосервере и схемы в БД.
     *
     * @param id          Идентификатор проекта.
     * @param projectName Новое название проекта.
     */
    public void update(long id, String projectName, Authentication authentication) {
        Project project;
        if (isRoot(authentication)) {
            project = projectRepository
                    .findById(id)
                    .orElseThrow(() -> new NotFoundException(id));
        } else {
            Long orgId = getOrganizationId(authentication);

            project = projectRepository
                    .findByIdAndOrganizationId(id, orgId)
                    .orElseThrow(() -> new NotFoundException(id));
        }

        project.setName(projectName);
        project.setLastModified(LocalDateTime.now());

        projectRepository.save(project);
    }

    public ProjectProjection create(ProjectRequestDto dto, Authentication authentication) {
        Long orgId = getOrganizationId(authentication);

        log.info("Init create project: {} for organization: {}", dto.getProjectName(), orgId);

        Optional<Project> projectWithSameName =
                projectRepository.findByNameAndOrganizationId(dto.getProjectName(), orgId);
        if (projectWithSameName.isPresent()) {
            throw new ConflictException("Проект с таким именем уже существует");
        }

        Project newProject = new Project(dto.getProjectName(), orgId);
        Project savedProject = projectRepository.save(newProject);

        savedProject.setInternalName(DEFAULT_PROJECT_NAME + "_" + savedProject.getId());

        projectRepository.save(savedProject);

        try {
            new GeoserverProjectService(getRootAccessToken())
                    .createProject(savedProject.getInternalName(), orgId);

            projectRepository.save(savedProject);
        } catch (GeoserverClientException e) {
            throw new ConflictException("Не удалось создать проект на геосервере", e.getCause());
        }

        return factory.createProjection(ProjectProjection.class, savedProject);
    }

    public void delete(Long projectId, Authentication authentication) {
        // TODO: Переделать удаление(вместе с созданием) проекта как процесс при удалении:
        //  - удаление данных из БД
        //  - удаление потрахов с геосервера: рабочей области и прав на нее (нужен рут токен для удаления прав)

        Long orgId = getOrganizationId(authentication);
        Project project = projectRepository
                .findByIdAndOrganizationId(projectId, orgId)
                .orElseThrow(() -> new NotFoundException(projectId));

        try {
            projectRepository.delete(project);

            new GeoserverProjectService(getToken(authentication))
                    .deleteProject(project.getInternalName());
        } catch (GeoserverClientException e) {
            throw new GisServiceException("Не удалось удалить проект на геосервере: " + projectId, e.getCause());
        } catch (Exception e) {
            throw new GisServiceException("Не удалось удалить проект: " + projectId, e.getCause());
        }
    }

    private List<Project> filterByPermissions(List<Project> projects, UserDetails userDetails) {
        final Long userId = userDetails.getUserId();
        final List<Long> groupsIds = userDetails.getGroups();

        // Нужно просмотреть все пермишены проекта, там должны быть какието касательно пользователя или его группы,
        // если таковых нет то нет доступа, отфильтровываем
        return projects
                .stream()
                .filter(project -> {
                    final List<Permission> permissions = project.getPermissions();
                    boolean isExist = false;
                    for (Permission permission : permissions) {
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

    private String getRootAccessToken() {
        String rootUserName = environment.getRequiredProperty("crg-options.root-user-name");
        String rootUserPass = environment.getRequiredProperty("crg-options.root-user-password");

        try {
            return oAuthClient.getToken(rootUserName, rootUserPass)
                              .orElseThrow(() -> new GisServiceException("Error get root token"))
                              .getAccess_token();
        } catch (Exception e) {
            throw new GisServiceException("Error get root token");
        }
    }
}
