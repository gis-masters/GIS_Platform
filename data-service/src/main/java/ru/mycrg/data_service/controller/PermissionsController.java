package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dao.TablesDDL;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.TableIdentifier;

import javax.inject.Inject;
import javax.validation.Valid;

import static ru.mycrg.data_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class PermissionsController {

    @Inject
    private LocalValidatorFactoryBean validator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(validator);
    }

    private final TablesDDL tablesDDL;
    private final PermissionsService permissionsService;

    public PermissionsController(TablesDDL tablesDDL,
                                 PermissionsService permissionsService) {
        this.tablesDDL = tablesDDL;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @PostMapping("/schemas/{schemaName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermission(@PathVariable String schemaName,
                                                              @PathVariable String tableName,
                                                              @Valid @RequestBody PermissionCreateDto dto) {
        TableIdentifier tableIdentifier = new TableIdentifier(schemaName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        var permissionProjection = permissionsService.create(tableIdentifier, dto);

        return ResponseEntity.ok(permissionProjection);
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @GetMapping("/schemas/{schemaName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<Object> getPermission(@PathVariable String schemaName,
                                                @PathVariable String tableName,
                                                Pageable pageable) {
        TableIdentifier tableIdentifier = new TableIdentifier(schemaName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        var permissions = permissionsService.getForResource(tableIdentifier, pageable);

        return ResponseEntity.ok(permissions);
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/schemas/{schemaName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<Object> deletePermission(@PathVariable String schemaName,
                                                   @PathVariable String tableName) {
        TableIdentifier tableIdentifier = new TableIdentifier(schemaName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        permissionsService.deleteAllByResourceIdentifier(tableIdentifier);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/schemas/{schemaName}/tables/{tableName}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deletePermission(@PathVariable String schemaName,
                                                   @PathVariable String tableName,
                                                   @PathVariable Long permissionId) {
        TableIdentifier tableIdentifier = new TableIdentifier(schemaName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        permissionsService.deleteByPermissionId(tableIdentifier, permissionId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
