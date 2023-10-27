package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.repository.PermissionRepository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.security.Roles.OWNER;

@Service
public class ResourceProtector {

    private final Logger log = LoggerFactory.getLogger(ResourceProtector.class);

    private final IAuthenticationFacade authenticationFacade;
    private final PermissionRepository permissionRepository;

    public ResourceProtector(IAuthenticationFacade authenticationFacade,
                             PermissionRepository permissionRepository) {
        this.authenticationFacade = authenticationFacade;
        this.permissionRepository = permissionRepository;
    }

    public Optional<String> defineBestRole(Project project) {
        List<Permission> userPermissions = getUserPermissionsForProject(project);
        List<Long> userPermissionIds = userPermissions.stream()
                                                      .map(Permission::getPrincipalId)
                                                      .collect(Collectors.toList());

        log.warn("Try define best role for project: {}. Collected user permissions: {}",
                 project.getId(), userPermissionIds);
        if (userPermissionIds.isEmpty()) {
            return Optional.empty();
        }

        return permissionRepository.getBestRoleForProject(userPermissionIds, project.getId());
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
    public boolean isOwner(Project project) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(project)
                || authenticationFacade.isRoot();
    }

    private boolean isUserHasOwnPermission(Project project) {
        Optional<String> oRole = defineBestRole(project);
        if (oRole.isEmpty()) {
            return false;
        }

        return Objects.equals(OWNER.name(), oRole.get());
    }
}
