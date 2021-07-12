package ru.mycrg.data_service.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.Resource;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Role;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.*;
import ru.mycrg.data_service.repository.PermissionRepository;
import ru.mycrg.data_service.repository.PrincipalRepository;
import ru.mycrg.data_service.repository.RoleRepository;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.security.AuthenticationFacade;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.util.RoleHandler.defineIdByRole;

@Service
@Transactional
public class PermissionsService {

    private final ProjectionFactory projectionFactory;
    private final RoleRepository roleRepository;
    private final ResourceProtector resourceProtector;
    private final PrincipalService principalService;
    private final AuthenticationFacade authenticationFacade;
    private final PrincipalRepository principalRepository;
    private final PermissionRepository permissionRepository;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public PermissionsService(ResourceProtector resourceProtector,
                              PrincipalService principalService,
                              PermissionRepository permissionRepository,
                              PrincipalRepository principalRepository,
                              RoleRepository roleRepository,
                              AuthenticationFacade authenticationFacade,
                              ProjectionFactory projectionFactory,
                              SchemasAndTablesRepository schemasAndTablesRepository) {
        this.resourceProtector = resourceProtector;
        this.principalService = principalService;
        this.permissionRepository = permissionRepository;
        this.principalRepository = principalRepository;
        this.roleRepository = roleRepository;
        this.authenticationFacade = authenticationFacade;
        this.projectionFactory = projectionFactory;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    /**
     * Возвращает выборку согласно {@link Pageable} запросу.
     * <p>
     * Если пользователь является владельцем ресурса или имеет роли GLOBAL_ADMIN, ORG_ADMIN, возвращаются все
     * разрешения.
     * <p>
     * Если у пользователя нет особых прав, возвращаются только его собственные разрешения выданные на данный ресурс.
     *
     * @param rQualifier Ресурс
     * @param pageable   Pagination information
     */
    public Page<PermissionProjection> getAllByResourceId(ResourceQualifier rQualifier, Long resId, Pageable pageable) {
        final String tableName = rQualifier.toString();

        if (resourceProtector.isOwner(rQualifier)) {
            return permissionRepository.findAllByResourceTableAndResourceId(tableName, resId, pageable);
        } else {
            final List<Principal> principals = principalService.getAll();

            return permissionRepository
                    .findAllByResourceTableAndResourceIdAndPrincipalIn(tableName, resId, principals, pageable);
        }
    }

    public Page<Resource> getAll(Pageable pageable) {
        final Page<SchemasAndTables> schemasAndTables = schemasAndTablesRepository.findAll(pageable);

        final List<Resource> result = schemasAndTables
                .stream()
                .map(item -> {
                    final Resource resource = new Resource();
                    final List<PermissionProjection> permissions = permissionRepository
                            .findAllByResourceTableAndResourceId("schemas_and_tables", item.getId());

                    resource.setCreatedAt(item.getCreatedAt().toString());
                    resource.setPermissions(permissions);

                    final boolean isFolder = item.isFolder();
                    if (isFolder) {
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

    /**
     * Создание правила.
     *
     * @param tableQualifier Определяет таблицу для которой создаётся правило
     * @param resourceId     Идентификатор объекта
     * @param dto            Модель правила
     *
     * @throws ForbiddenException если у пользователя нет прав на создание.
     * @throws ConflictException  если такое правило уже существует.
     */
    public PermissionProjection create(ResourceQualifier tableQualifier, Long resourceId, PermissionCreateDto dto) {
        if (!resourceProtector.isOwner(tableQualifier)) {
            throw new ForbiddenException("Not allowed create permission for this resource");
        }

        try {
            final Role role = roleRepository.findById(defineIdByRole(dto.getRole()))
                                            .orElseThrow(() -> new NotFoundException("Not found role"));

            final Principal principal = principalService.getOrCreate(dto.getPrincipalId(),
                                                                     dto.getPrincipalType());

            final Permission permission = new Permission();
            permission.setRole(role);
            permission.setPrincipal(principal);
            permission.setResourceTable(tableQualifier.toString());
            permission.setResourceId(resourceId);
            permission.setCreatedBy(authenticationFacade.getLogin());

            final Permission newPermission = permissionRepository.save(permission);

            return projectionFactory.createProjection(PermissionProjection.class, newPermission);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Already joined");
        } catch (Exception e) {
            throw new DataServiceException("Failed to create permission. Reason: " + e.getMessage());
        }
    }

    public void deleteById(Long permissionId) {
        permissionRepository.deleteById(permissionId);
    }

    public Permission addOwnerPermission(ResourceQualifier targetTable, long id) {
        final Long userId = authenticationFacade.getUserDetails().getUserId();

        final Role role = roleRepository.findById(30L)
                                        .orElseThrow(() -> new NotFoundException("Not found role"));

        Principal principal = principalRepository
                .findByIdentifierAndType(userId, "user")
                .orElseGet(() -> principalRepository.save(new Principal(userId, "user")));

        final Permission permission = new Permission();
        permission.setRole(role);
        permission.setPrincipal(principal);
        permission.setCreatedAt(LocalDateTime.now());
        permission.setLastModified(LocalDateTime.now());
        permission.setCreatedBy(authenticationFacade.getLogin());
        permission.setResourceTable(targetTable.getTable());
        permission.setResourceId(id);

        return permissionRepository.save(permission);
    }

    public void delete(Permission permission) {
        permissionRepository.delete(permission);
    }

    public void deleteAssigned(ResourceQualifier targetTable, Long resourceId) {
        permissionRepository.deleteByResourceTableAndResourceId(targetTable.getTable(), resourceId);
    }

    public Optional<Role> getBestDatasetRole(ResourceQualifier qualifier, Long resourceId) {
        final List<Principal> principals = principalService.getAll();

        return permissionRepository.bestRoleNonHierarchy(qualifier.getTable(), resourceId, principals)
                                   .flatMap(roleRepository::findById);
    }
}
