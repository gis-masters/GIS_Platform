package ru.mycrg.gis_service.service;

import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.gis_service.security.UserDetails;

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

    public boolean isOwner(Project project) {
        final Optional<String> oRole = defineBestRole(project.getPermissions());

        if (oRole.isEmpty()) {
            return false;
        } else {
            return Objects.equals(oRole.get(), OWNER.name());
        }
    }
}
