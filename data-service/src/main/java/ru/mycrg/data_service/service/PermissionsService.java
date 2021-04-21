package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common_utils.security.RoleHierarchy;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.PermissionsRepository;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.security.UserDetails;
import ru.mycrg.data_service.service.resources.PrincipalService;
import ru.mycrg.data_service.service.resources.ResourceProtector;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.Paginator.getPage;

@Service
@Transactional
public class PermissionsService {

    private final RoleHierarchy roleHierarchy;
    private final PrincipalService principalService;
    private final ResourceProtector resourceProtector;
    private final ProjectionFactory projectionFactory;
    private final IAuthenticationFacade authenticationFacade;
    private final PermissionsRepository permissionsRepository;

    public PermissionsService(PermissionsRepository permissionsRepository,
                              IAuthenticationFacade authenticationFacade,
                              PrincipalService principalService,
                              RoleHierarchy roleHierarchy,
                              ResourceProtector resourceProtector,
                              ProjectionFactory projectionFactory) {
        this.roleHierarchy = roleHierarchy;
        this.principalService = principalService;
        this.resourceProtector = resourceProtector;
        this.projectionFactory = projectionFactory;
        this.permissionsRepository = permissionsRepository;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Возвращает выборку согласно {@link Pageable} запросу.
     * <p>
     * Если пользователь является владельцем ресурса или имеет роли GLOBAL_ADMIN, ORG_ADMIN или OWNER, возвращаются все
     * разрешения.
     * <p>
     * Если у пользователя нет особых прав, возвращаются только его собственные разрешения выданные на данный ресурс.
     *
     * @param resource Ресурс
     * @param pageable Pagination information
     */
    public Page<PermissionProjection> getPaged(Resource resource, Pageable pageable) {
        if (resourceProtector.isAbsoluteOwner(resource)) {
            return permissionsRepository.getAllByResource(resource, pageable);
        } else {
            final Set<String> relatedRoles = getAllRelatedRoles(resource);
            final Optional<String> oRole = roleHierarchy.defineBest(relatedRoles);
            if (oRole.isEmpty()) {
                return new PageImpl<>(new ArrayList<>());
            }

            if (oRole.get().equals(Roles.OWNER.name())) {
                return permissionsRepository.getAllByResource(resource, pageable);
            } else {
                final Set<PermissionProjection> relatedPermissions = getAllRelatedPermissions(resource);

                return getPage(new ArrayList<>(relatedPermissions), pageable);
            }
        }
    }

    /**
     * Находим все роли исходя из разрешений выданных на данный ресурс, имеющие отношение к пользователю(т.е. заданные
     * либо непосредственно для пользователя либо заданные на группу в которой пользователь состоит)
     *
     * @param resource Ресурс
     */
    public Set<String> getAllRelatedRoles(Resource resource) {
        final UserDetails userDetails = authenticationFacade.getUserDetails();

        return permissionsRepository
                .findByRelatedPermissions(resource.getId(), userDetails.getUserId(), userDetails.getGroups())
                .stream()
                .map(PermissionProjection::getRole)
                .collect(Collectors.toSet());
    }

    /**
     * Возвращает все разрешения выданные на данный ресурс, имеющие отношение к пользователю(т.е. заданные либо
     * непосредственно для пользователя либо заданные на группу в которой пользователь состоит)
     *
     * @param resource Ресурс
     */
    public Set<PermissionProjection> getAllRelatedPermissions(Resource resource) {
        final UserDetails userDetails = authenticationFacade.getUserDetails();

        return permissionsRepository.findByRelatedPermissions(resource.getId(),
                                                              userDetails.getUserId(),
                                                              userDetails.getGroups());
    }

    public PermissionProjection create(@NotNull Resource resource,
                                       @NotNull PermissionCreateDto dto) {
        Set<String> relatedRoles = getAllRelatedRoles(resource);
        if (!resourceProtector.isCreatePermissionAllowed(resource, relatedRoles)) {
            throw new ForbiddenException("Not allowed create permission for this resource");
        }

        final Principal principal = principalService.getOrCreate(dto.getPrincipalId(), dto.getPrincipalType());

        throwIfExist(resource, principal, dto.getRole());

        final Optional<Permission> oPermission = permissionsRepository.findByResourceAndPrincipal(resource, principal);
        if (oPermission.isPresent()) { // Rewrite role
            final Permission existPermission = oPermission.get();
            existPermission.setRole(dto.getRole());

            final Permission updatedPermission = permissionsRepository.save(existPermission);

            return projectionFactory.createProjection(PermissionProjection.class, updatedPermission);
        } else { // Create new permission
            final Permission newPermission = permissionsRepository.save(
                    new Permission(resource, principal, dto.getRole()));

            return projectionFactory.createProjection(PermissionProjection.class, newPermission);
        }
    }

    public void deleteById(@NotNull Resource resource, Long permissionId) {
        resource.getPermissions().stream()
                .filter(permission -> permission.getId() == permissionId)
                .findFirst()
                .ifPresentOrElse(permission -> {
                    permissionsRepository.deleteById(permission.getId());

                    principalService.deleteIfNoPermissions(permission.getPrincipal());
                }, () -> {
                    throw new NotFoundException(permissionId);
                });
    }

    public void throwIfExist(Resource resource, Principal principal, String role) {
        permissionsRepository
                .findByResourceAndPrincipalAndRole(resource, principal, role)
                .ifPresent(permission -> {
                    throw new ConflictException("Already joined");
                });
    }

    private Set<Permission> getPermissions(Long id, String type) {
        return principalService.get(id, type)
                               .map(Principal::getPermissions)
                               .orElseGet(HashSet::new);
    }
}
