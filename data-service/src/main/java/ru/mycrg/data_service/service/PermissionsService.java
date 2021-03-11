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

import java.util.Optional;

@Service
@Transactional
public class PermissionsService {

    private final ProjectionFactory projectionFactory;
    private final PermissionsRepository permissionsRepository;
    private final PrincipalService principalService;

    public PermissionsService(PermissionsRepository permissionsRepository,
                              PrincipalService principalService,
                              ProjectionFactory projectionFactory) {
        this.projectionFactory = projectionFactory;
        this.principalService = principalService;
        this.permissionsRepository = permissionsRepository;
    }

    // TODO: Продолжить закрывать дыры, список всех выставленных прав могут видеть только владелец и рут.
    // Что может видеть пользователь с другими правами?
    public Page<PermissionProjection> getPaged(Resource resource, Pageable pageable) {
        // У самого ресурса мы можем спросить все его разрешения (resource.getPermissions()), но делаем это через
        // базу чтобы иметь pageable ответ из коробки.
        return permissionsRepository.getAllByResource(resource, pageable);
    }

    public PermissionProjection create(@NotNull Resource resource,
                                       @NotNull PermissionCreateDto dto) {
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
}
