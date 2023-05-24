package ru.mycrg.gis_service.service;

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

import static java.util.Objects.isNull;
import static ru.mycrg.gis_service.security.Roles.OWNER;

@Service
public class ResourceProtector {

    private final IAuthenticationFacade authenticationFacade;
    private final PermissionRepository permissionRepository;

    public ResourceProtector(IAuthenticationFacade authenticationFacade,
                             PermissionRepository permissionRepository) {
        this.authenticationFacade = authenticationFacade;
        this.permissionRepository = permissionRepository;
    }

    public Optional<String> defineBestRole(Project project) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        List<Long> userIds = userDetails.getGroups();
        userIds.add(userDetails.getUserId());

        List<Long> userPermissionsIds = project.getPermissions()
                                               .stream()
                                               .map(Permission::getPrincipalId)
                                               .filter(userIds::contains)
                                               .collect(Collectors.toList());

        return permissionRepository.getBestRoleForProject(userPermissionsIds, project.getId());
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
