package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.service.projects.ProjectService;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.security.Roles.OWNER;
import static ru.mycrg.gis_service.security.Roles.VIEWER;

@Service
public class ProjectProtector {

    private final ProjectService projectService;
    private final IAuthenticationFacade authenticationFacade;

    public ProjectProtector(ProjectService projectService,
                            IAuthenticationFacade authenticationFacade) {
        this.projectService = projectService;
        this.authenticationFacade = authenticationFacade;
    }

    @NotNull
    public List<Permission> getUserPermissionsForProject(Project project) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        List<Long> userIds = userDetails.getGroups();
        userIds.add(userDetails.getUserId());

        return project.getPermissions()
                      .stream()
                      .filter(permission -> userIds.contains(permission.getPrincipalId()))
                      .collect(Collectors.toList());
    }

    /**
     * Считаем что пользователь является владельцем ресурса, если:
     * <li> Пользователь имеет OWNER право.
     * <li> Пользователей является SYSTEM_ADMIN или ORG_ADMIN.
     */
    public boolean isOwner(Long id) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(id)
                || authenticationFacade.isRoot();
    }

    public boolean lessThenContributor(Long id) {
        Optional<String> oRole = defineBestRole(id);

        return !moreThenViewer(oRole);
    }

    public boolean lessThenContributor(ProjectProjectionImpl projection) {
        Optional<String> oRole = Optional.ofNullable(projection.getRole());

        return !moreThenViewer(oRole);
    }

    public void throwIfMoveNotAllowed(Long id) {
        if (lessThenContributor(id)) {
            throw new ForbiddenException("Недостаточно прав для перемещения проекта: " + id);
        }
    }

    public void throwIfMoveNotAllowed(ProjectProjectionImpl movedFolder) {
        throwIfMoveNotAllowed(movedFolder.getId());
    }

    private static boolean moreThenViewer(Optional<String> oRole) {
        return oRole.filter(s -> !Objects.equals(VIEWER.name(), s))
                    .isPresent();
    }

    private Optional<String> defineBestRole(Long id) {
        String role = projectService.getByIdWithRole(id)
                                    .getRole();

        return Optional.ofNullable(role);
    }

    private boolean isUserHasOwnPermission(Long id) {
        return defineBestRole(id)
                .filter(s -> Objects.equals(OWNER.name(), s))
                .isPresent();
    }
}
