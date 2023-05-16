package ru.mycrg.gis_service.service;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static ru.mycrg.gis_service.security.Roles.OWNER;
import static ru.mycrg.gis_service.security.Roles.VIEWER;

@Service
public class ResourceProtector {

    private final IAuthenticationFacade authenticationFacade;

    public ResourceProtector(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public Optional<String> defineBestRole(Set<Permission> permissions) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        List<Long> userIds = userDetails.getGroups();
        userIds.add(userDetails.getUserId());

        String bestRole = null;
        List<Permission> userPermissions = permissions
                .stream()
                .filter(permission -> userIds.contains(permission.getPrincipalId()))
                .collect(Collectors.toList());

        for (Permission permission: userPermissions) {
            if (permission.getRole().getName().equals(OWNER.name())) {
                bestRole = OWNER.name();
                break;
            } else if (permission.getRole().getName().equals(VIEWER.name())) {
                bestRole = VIEWER.name();
            }
        }

        if (isNull(bestRole)) {
            return Optional.empty();
        } else {
            return Optional.of(bestRole);
        }
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
        Optional<String> oRole = defineBestRole(project.getPermissions());
        if (oRole.isEmpty()) {
            return false;
        }

        return Objects.equals(OWNER.name(), oRole.get());
    }
}
