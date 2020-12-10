package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.PermissionsRepository;
import ru.mycrg.data_service.service.resources.PrincipalService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourcesService;

import java.util.Optional;

@Service
@Transactional
public class PermissionsService {

    private final ProjectionFactory projectionFactory;
    private final PermissionsRepository permissionsRepository;
    private final PrincipalService principalService;
    private final ResourcesService resourcesService;

    public PermissionsService(PermissionsRepository permissionsRepository,
                              ResourcesService resourcesService,
                              PrincipalService principalService,
                              ProjectionFactory projectionFactory) {
        this.resourcesService = resourcesService;
        this.projectionFactory = projectionFactory;
        this.principalService = principalService;
        this.permissionsRepository = permissionsRepository;
    }

    public Page<PermissionProjection> getForResource(ResourceIdentifier resIdentifier, Pageable pageable) {
        return permissionsRepository
                .getAllByResource(resourcesService.get(resIdentifier), pageable);
    }

    public PermissionProjection create(@NotNull ResourceIdentifier resIdentifier,
                                       @NotNull PermissionCreateDto dto) {
        final Resource resource = resourcesService.get(resIdentifier);
        final Principal principal = principalService.get(dto.getPrincipalId(), dto.getPrincipalType());

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

    public void deleteById(ResourceIdentifier rIdentifier, Long permissionId) {
        resourcesService.get(rIdentifier)
                        .getPermissions().stream()
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
}
