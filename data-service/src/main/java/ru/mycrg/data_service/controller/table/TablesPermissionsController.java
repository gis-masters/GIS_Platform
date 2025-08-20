package ru.mycrg.data_service.controller.table;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreatePermissionRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeletePermissionRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.net.URI;
import java.util.ArrayList;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@RestController
public class TablesPermissionsController {

    private final TableService tableService;
    private final PermissionsService permissionsService;
    private final Mediator mediator;

    public TablesPermissionsController(TableService tableService,
                                       PermissionsService permissionsService,
                                       Mediator mediator) {
        this.tableService = tableService;

        this.permissionsService = permissionsService;
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/tables/{tableId}/roleAssignment")
    public ResponseEntity<PermissionsService> addPermissionToTable(@PathVariable String datasetId,
                                                                   @PathVariable String tableId,
                                                                   @Valid @RequestBody PermissionCreateDto dto,
                                                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        ResourceQualifier tQualifier = new ResourceQualifier(datasetId, tableId);

        TableModel table = tableService.getInfo(tQualifier);

        PermissionProjection permission = mediator.execute(
                new CreatePermissionRequest(tQualifier, table.getId(), dto));

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{datasetId}/tables/{tableId}/roleAssignment/{id}")
                .buildAndExpand(datasetId, tableId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables/{tableId}/roleAssignment")
    public ResponseEntity<Object> getTablePermissions(@PathVariable String datasetId,
                                                      @PathVariable String tableId,
                                                      Pageable pageable) {
        Page<PermissionProjection> permissions;
        try {
            ResourceQualifier tQualifier = new ResourceQualifier(datasetId, tableId);

            TableModel table = tableService.getInfo(tQualifier);

            permissions = permissionsService.getAllByResourceId(tQualifier, table.getId(), pageable);
        } catch (ForbiddenException e) {
            permissions = new PageImpl<>(new ArrayList<>());
        }

        return ResponseEntity.ok(pageFromList(permissions, pageable));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}/tables/{tableId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteTablePermission(@PathVariable String datasetId,
                                                        @PathVariable String tableId,
                                                        @PathVariable Long permissionId) {
        ResourceQualifier tQualifier = new ResourceQualifier(datasetId,
                                                             tableId,
                                                             TABLE);

        mediator.execute(new DeletePermissionRequest(tQualifier, permissionId));

        return ResponseEntity.noContent().build();
    }
}
