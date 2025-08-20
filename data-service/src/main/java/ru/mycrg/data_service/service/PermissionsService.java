package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.Resource;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Role;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.PermissionRepository;
import ru.mycrg.data_service.repository.PrincipalRepository;
import ru.mycrg.data_service.repository.RoleRepository;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;

@Service
@Transactional
public class PermissionsService {

    private final RoleRepository roleRepository;
    private final PrincipalService principalService;
    private final PrincipalRepository principalRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final PermissionRepository permissionRepository;
    private final IMasterResourceProtector resourceProtector;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public PermissionsService(PrincipalService principalService,
                              PermissionRepository permissionRepository,
                              PrincipalRepository principalRepository,
                              RoleRepository roleRepository,
                              IAuthenticationFacade authenticationFacade,
                              SchemasAndTablesRepository schemasAndTablesRepository,
                              MasterResourceProtector resourceProtector) {
        this.principalService = principalService;
        this.permissionRepository = permissionRepository;
        this.principalRepository = principalRepository;
        this.roleRepository = roleRepository;
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.resourceProtector = resourceProtector;
    }

    /**
     * Возвращает выборку согласно {@link Pageable} запросу.
     * <p>
     * Если пользователь является владельцем ресурса или имеет роли SYSTEM_ADMIN, ORG_ADMIN, возвращаются все
     * разрешения.
     * <p>
     * Если у пользователя нет особых прав, возвращаются только его собственные разрешения выданные на данный ресурс.
     *
     * @param rQualifier Квалификатор ресурса
     * @param pageable   Pagination information
     */
    public Page<PermissionProjection> getAllByResourceId(ResourceQualifier rQualifier, Long resId, Pageable pageable) {
        String tableName = rQualifier.getResourceTable();

        if (resourceProtector.isOwner(rQualifier)) {
            return permissionRepository.findAllByResourceTableAndResourceId(tableName, resId, pageable);
        } else {
            List<Principal> principals = principalService.getAll();

            return permissionRepository
                    .findAllByResourceTableAndResourceIdAndPrincipalIn(tableName, resId, principals, pageable);
        }
    }

    public Page<PermissionProjection> getAllByResourceId(ResourceQualifier rQualifier, Pageable pageable) {
        if (resourceProtector.isOwner(rQualifier)) {
            return permissionRepository.findAllByResourceTableAndResourceId(rQualifier.getResourceTable(),
                                                                            rQualifier.getRecordIdAsLong(),
                                                                            pageable);
        } else {
            return permissionRepository.findAllByResourceTableAndResourceIdAndPrincipalIn(rQualifier.getResourceTable(),
                                                                                          rQualifier.getRecordIdAsLong(),
                                                                                          principalService.getAll(),
                                                                                          pageable);
        }
    }

    public Page<Resource> getAll(Pageable pageable) {
        Page<SchemasAndTables> schemasAndTables = schemasAndTablesRepository.findAll(pageable);

        List<Resource> result = schemasAndTables
                .stream()
                .map(item -> {
                    final Resource resource = new Resource();
                    final List<PermissionProjection> permissions = permissionRepository
                            .findAllByResourceTableAndResourceId("schemas_and_tables", item.getId());

                    resource.setPermissions(permissions);

                    if (item.getCreatedAt() != null) {
                        resource.setCreatedAt(item.getCreatedAt().toString());
                    }

                    if (item.isFolder()) {
                        resource.setType("SCHEMA");
                        resource.setIdentifier(item.getIdentifier());
                    } else {
                        resource.setType("TABLE");

                        try {
                            final String id = item.getPath().split("/root/")[1];
                            schemasAndTablesRepository
                                    .findById(Long.valueOf(id))
                                    .ifPresent(parent -> {
                                        final String identifier = parent.getIdentifier() + "." + item.getIdentifier();
                                        resource.setIdentifier(identifier);
                                    });
                        } catch (Exception e) {
                            resource.setIdentifier(item.getIdentifier());
                        }
                    }

                    return resource;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(result, pageable, schemasAndTables.getTotalElements());
    }

    public void deleteById(ResourceQualifier rQualifier, Long permissionId) {
        if (!resourceProtector.isOwner(rQualifier)) {
            throw new ForbiddenException("Недостаточно прав для удаления разрешения: " + permissionId);
        }

        permissionRepository.deleteById(permissionId);
    }

    public Permission addOwnerPermission(ResourceQualifier targetTable, long id) {
        Long userId = authenticationFacade.getUserDetails().getUserId();

        Role role = roleRepository.findById(30L)
                                  .orElseThrow(() -> new NotFoundException("Not found role"));

        Principal principal = principalRepository
                .findByIdentifierAndType(userId, "user")
                .orElseGet(() -> principalRepository.save(new Principal(userId, "user")));

        Optional<Permission> oPerm = permissionRepository
                .findByResourceTableAndResourceIdAndPrincipalAndRole(targetTable.getTable(), id, principal, role);
        if (oPerm.isEmpty()) {
            Permission permission = new Permission();
            permission.setRole(role);
            permission.setPrincipal(principal);
            permission.setCreatedAt(now());
            permission.setLastModified(now());
            permission.setCreatedBy(authenticationFacade.getLogin());
            permission.setResourceTable(targetTable.getTable());
            permission.setResourceId(id);

            return permissionRepository.save(permission);
        }

        return oPerm.get();
    }

    public void delete(Permission permission) {
        permissionRepository.delete(permission);
    }

    public void deleteAssigned(ResourceQualifier targetTable, Long resourceId) {
        permissionRepository.deleteByResourceTableAndResourceId(targetTable.getTable(), resourceId);
    }
}
