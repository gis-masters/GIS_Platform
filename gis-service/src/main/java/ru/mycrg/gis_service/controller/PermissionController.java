package ru.mycrg.gis_service.controller;

import jakarta.json.JsonMergePatch;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.PermissionCreateDto;
import ru.mycrg.gis_service.dto.PermissionProjection;
 
import ru.mycrg.gis_service.service.PermissionsService;

import java.util.List;
import java.util.Map;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects")
public class PermissionController {

    private final Logger log = LoggerFactory.getLogger(PermissionController.class);

    private final PermissionsService permissionsService;

    public PermissionController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @GetMapping("/all-permissions")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Map<Long, List<PermissionProjection>>> getAllPermissions() {
        Map<Long, List<PermissionProjection>> allPermissions = permissionsService.getAll();

        return ResponseEntity.ok(allPermissions);
    }

    @GetMapping("/{project_id}/permissions")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<PermissionProjection>> getPermissions(
            @PathVariable(name = "project_id") long projectId) {
        List<PermissionProjection> permissions = permissionsService.getAllAllowed(projectId);

        return ResponseEntity.ok(permissions);
    }

    @PostMapping("/{project_id}/permissions")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<PermissionProjection> createPermission(@PathVariable(name = "project_id") long projectId,
                                                                 @Valid @RequestBody PermissionCreateDto dto) {
        log.debug("Запрос на создание правила [{}] для проекта {}", dto, projectId);

        PermissionProjection permission = permissionsService.create(projectId, dto);

        return new ResponseEntity<>(permission, HttpStatus.CREATED);
    }

    @GetMapping("/{project_id}/permissions/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public EntityModel<PermissionProjection> getPermissionById(@PathVariable(name = "project_id") long projectId,
                                                               @PathVariable(name = "id") long permissionId) {
        PermissionProjection permission = permissionsService.getById(projectId, permissionId);

        return EntityModel.of(permission);
    }

    @PatchMapping(path = "/{project_id}/permissions/{id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updatePermission(@PathVariable(name = "project_id") long projectId,
                                                   @PathVariable(name = "id") long permissionId,
                                                   @RequestBody JsonMergePatch patchDto) {
        log.debug("update permission for project: {} to: {}", projectId, patchDto.toJsonValue());

        permissionsService.update(projectId, permissionId, patchDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{project_id}/permissions/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deletePermission(@PathVariable(name = "project_id") long projectId,
                                                   @PathVariable(name = "id") long permissionId) {
        log.debug("Request for deletion permission {} for project {}", permissionId, projectId);

        permissionsService.delete(projectId, permissionId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/permissions/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteEntityPermissions(@RequestParam(name = "principal_type") String principalType,
                                                          @PathVariable(name = "id") long principalId) {
        log.debug("Запрос на удаление разрешений {}: {} ", principalType, principalId);

        permissionsService.deletePermissions(principalId, principalType);

        return ResponseEntity.noContent().build();
    }
}
