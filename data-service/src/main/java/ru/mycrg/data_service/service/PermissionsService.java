package ru.mycrg.data_service.service;

import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.PermissionWithoutResourceProjection;
import ru.mycrg.data_service.dto.TableDto;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.PermissionsRepository;
import ru.mycrg.data_service.repository.ResourceRepository;
import ru.mycrg.data_service.security.UserDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Log4j2
@Service
@Transactional
public class PermissionsService {

    public static final int RESOURCES_PER_PERMISSION_LIMIT = 1000;

    private final ProjectionFactory projectionFactory;
    private final PermissionsRepository permissionsRepository;
    private final ResourceRepository resourceRepository;

    public PermissionsService(PermissionsRepository permissionsRepository,
                              ResourceRepository resourceRepository,
                              ProjectionFactory projectionFactory) {
        this.projectionFactory = projectionFactory;
        this.resourceRepository = resourceRepository;
        this.permissionsRepository = permissionsRepository;
    }

    public Page<PermissionWithoutResourceProjection> getForResource(TableIdentifier resource, Pageable pageable) {
        return permissionsRepository.getAllByResourceIdentifier(resource.toString(), pageable);
    }

    public List<TableDto> getAllByResource(String schemaName, List<Long> ids) {
        return permissionsRepository
                .getAllByResourceIdentifierAndPrincipalIds(schemaName, ids).stream()
                .map(TableIdentifier::extractTableName)
                .map(TableDto::new)
                .collect(Collectors.toList());
    }

    public PermissionProjection create(@NotNull TableIdentifier resource,
                                       @NotNull PermissionCreateDto dto) {
        Permission permission;
        Optional<Permission> oPermission = permissionsRepository
                .findPermissionByParams(dto.getPrincipalType(), dto.getPrincipalId(), dto.getRole());

        if (oPermission.isPresent()) {
            permission = oPermission.get();

            joinResource(permission, resource.toString());
        } else {
            log.debug("Create new permission for: {} / {}", resource.getTable(), dto);

            permission = createNewPermission(dto, resource.toString());
        }

        return projectionFactory.createProjection(PermissionProjection.class, permission);
    }

    public void deleteByPermissionId(TableIdentifier resource, Long permissionId) {
        permissionsRepository
                .getByIdWithSpecificResource(permissionId, resource.toString(), TABLE.toString())
                .ifPresentOrElse(permission -> deleteResource(permission, resource.toString()), () -> {
                    throw new NotFoundException("Not found permission: " + permissionId);
                });
    }

    public void deleteAllByResourceIdentifier(TableIdentifier tableIdentifier) {
        Set<Permission> permissions = permissionsRepository
                .getAllByResourceIdentifierAndType(tableIdentifier.toString(), TABLE.toString());

        if (permissions.isEmpty()) {
            throw new NotFoundException("Not found permissions for: " + tableIdentifier.toString());
        }

        // Delete Resource from all permissions
        for (Permission permission : permissions) {
            Set<Resource> resources = permission.getResources();

            resources.stream()
                    .filter(resource -> resource.getIdentifier().equalsIgnoreCase(tableIdentifier.toString()))
                    .findFirst()
                    .ifPresent(resource -> {
                        resources.remove(resource);

                        resourceRepository.delete(resource);
                    });

            // Delete permission without resources
            if (resources.isEmpty()) {
                permissionsRepository.delete(permission);
            }
        }
    }

    public Optional<String> identifyPermission(UserDetails uDetails, String rIdentifier) {
        return permissionsRepository.getRoleForUser(uDetails.getUserId(), rIdentifier, TABLE.toString())
                .or(() -> permissionsRepository.getRoleForGroups(uDetails.getGroups(), rIdentifier, TABLE.toString()))
                .or(() -> permissionsRepository.getRoleForUser(uDetails.getUserId(), rIdentifier, SCHEMA.toString()))
                .or(() -> permissionsRepository.getRoleForGroups(uDetails.getGroups(), rIdentifier, SCHEMA.toString()));
    }

    private void joinResource(Permission permission, String identifier) {
        Set<Resource> resources = permission.getResources();
        if (resources.size() > RESOURCES_PER_PERMISSION_LIMIT) {
            throw new ConflictException("Limit by " + RESOURCES_PER_PERMISSION_LIMIT +
                    " resources by permission reached");
        }

        resources.stream()
                .filter(resource -> resource.getIdentifier().equalsIgnoreCase(identifier))
                .findFirst()
                .ifPresentOrElse(resource -> { // Resource already joined
                    throw new ConflictException("This permission already joined");
                }, () -> { // Create and join resource
                    Resource newResource = createNewResource(identifier);
                    permission.addResource(newResource);
                });
    }

    private Permission createNewPermission(@NotNull PermissionCreateDto dto, @NotNull String identifier) {
        Permission permission = new Permission();
        permission.setPrincipalType(dto.getPrincipalType());
        permission.setPrincipalId(dto.getPrincipalId());
        permission.setRole(dto.getRole());

        Permission savedPermission = permissionsRepository.save(permission);

        Resource newResource = createNewResource(identifier);

        savedPermission.addResource(newResource);

        return savedPermission;
    }

    private void deleteResource(Permission permission, String identifier) {
        Set<Resource> resources = permission.getResources();

        resources.stream()
                .filter(resource -> resource.getIdentifier().equalsIgnoreCase(identifier))
                .findFirst()
                .ifPresentOrElse(resource -> {
                    resources.remove(resource);

                    resourceRepository.delete(resource);

                    if (resources.isEmpty()) {
                        permissionsRepository.delete(permission);
                    }
                }, () -> {
                    throw new NotFoundException("Not found resource: " + identifier);
                });
    }

    private Resource createNewResource(@NotNull String identifier) {
        Resource resource = Resource.builder()
                .type(TABLE.toString())
                .identifier(identifier)
                .build();

        return resourceRepository.save(resource);
    }
}
