package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.PermissionCreateDto;
import ru.mycrg.gis_service.dto.PermissionProjection;
import ru.mycrg.gis_service.service.PermissionsService;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.gis_service.config.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects")
public class PermissionController {

    private static final Logger log = LoggerFactory.getLogger(PermissionController.class);

    private final PermissionsService permissionsService;

    public PermissionController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @GetMapping("/all-permissions")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Map<Long, List<PermissionProjection>>> getAllPermissions(Authentication authentication) {
        Map<Long, List<PermissionProjection>> allPermissions = permissionsService.getAll(authentication);

        return ResponseEntity.ok(allPermissions);
    }

    @GetMapping("/{project_id}/permissions")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<PermissionProjection>> getPermissions(@PathVariable(name = "project_id") long projectId,
                                                                     Authentication authentication) {
        List<PermissionProjection> permissions = permissionsService.getAll(projectId, authentication);

        return ResponseEntity.ok(permissions);
    }

    @PostMapping("/{project_id}/permissions")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<PermissionProjection> createPermission(@PathVariable(name = "project_id") long projectId,
                                                                 @Valid @RequestBody PermissionCreateDto dto,
                                                                 Authentication authentication) {
        log.debug("Try to create permission for project {}", dto.getPrincipalId());

        PermissionProjection permission = permissionsService.create(projectId, dto, authentication);

        return new ResponseEntity<>(permission, HttpStatus.CREATED);
    }

    @GetMapping("/{project_id}/permissions/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<PermissionProjection> getPermissionById(@PathVariable(name = "project_id") long projectId,
                                                            @PathVariable(name = "id") long permissionId,
                                                            Authentication authentication) {
        PermissionProjection permission = permissionsService.getById(projectId, permissionId, authentication);

        return new Resource<>(permission);
    }

    @PatchMapping(path = "/{project_id}/permissions/{id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updatePermission(@PathVariable(name = "project_id") long projectId,
                                                   @PathVariable(name = "id") long permissionId,
                                                   @RequestBody JsonMergePatch patchDto,
                                                   Authentication authentication) {
        log.debug("update permission for project: {} to: {}", projectId, patchDto.toJsonValue());

        permissionsService.update(projectId, permissionId, patchDto, authentication);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{project_id}/permissions/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deletePermission(@PathVariable(name = "project_id") long projectId,
                                                   @PathVariable(name = "id") long permissionId,
                                                   Authentication authentication) {
        log.debug("Request for deletion permission {} for project {}", permissionId, projectId);

        permissionsService.delete(projectId, permissionId, authentication);

        return ResponseEntity.noContent().build();
    }
}
