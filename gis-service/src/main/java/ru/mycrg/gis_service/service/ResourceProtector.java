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
import java.util.concurrent.atomic.AtomicReference;

import static ru.mycrg.gis_service.security.Roles.OWNER;
import static ru.mycrg.gis_service.security.Roles.VIEWER;

@Service
public class ResourceProtector {

    private final IAuthenticationFacade authenticationFacade;

    public ResourceProtector(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public Optional<String> defineBestRole(Set<Permission> permissions) {
        final UserDetails userDetails = authenticationFacade.getUserDetails();
        final List<Long> userIds = userDetails.getGroups();
        userIds.add(userDetails.getUserId());

        AtomicReference<String> bestRole = new AtomicReference<>();
        permissions.stream()
                   .filter(permission -> userIds.contains(permission.getPrincipalId()))
                   .forEach(permission -> {
                       if (permission.getRole().equals(OWNER.name())) {
                           bestRole.set(OWNER.name());
                       } else if (permission.getRole().equals(VIEWER.name())) {
                           bestRole.set(VIEWER.name());
                       }
                   });

        if (bestRole.get() == null) {
            return Optional.empty();
        } else {
            return Optional.of(bestRole.get());
        }
    }

    /**
     * Считаем что пользователь является владельцем ресурса, если:
     * <li> Пользователь имеет OWNER право.
     * <li> Пользователей является GLOBAL_ADMIN или ORG_ADMIN.
     */
    public boolean isOwner(Project project) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(project)
                || authenticationFacade.isRoot();
    }

    private boolean isUserHasOwnPermission(Project project) {
        final Optional<String> oRole = defineBestRole(project.getPermissions());
        if (oRole.isEmpty()) {
            return false;
        }

        return Objects.equals(OWNER.name(), oRole.get());
    }
}
