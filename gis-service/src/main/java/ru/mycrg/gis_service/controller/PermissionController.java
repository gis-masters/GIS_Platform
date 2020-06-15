package ru.mycrg.gis_service.controller;

import lombok.extern.log4j.Log4j2;
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

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.gis_service.config.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@Log4j2
@RestController
@RequestMapping("/projects/{project_id}")
public class PermissionController {

    private final PermissionsService permissionsService;

    public PermissionController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @GetMapping("/permissions")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<List<PermissionProjection>> getPermissions(@PathVariable(name = "project_id") long projectId,
                                                                     Authentication authentication) {
        List<PermissionProjection> permissions = permissionsService.getAll(projectId, authentication);

        return ResponseEntity.ok(permissions);
    }

    @PostMapping("/permissions")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<PermissionProjection> createPermission(@PathVariable(name = "project_id") long projectId,
                                                                 @Valid @RequestBody PermissionCreateDto dto,
                                                                 Authentication authentication) {
        PermissionProjection permission = permissionsService.create(projectId, dto, authentication);

        return new ResponseEntity<>(permission, HttpStatus.CREATED);
    }

    @GetMapping("/permissions/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public Resource<PermissionProjection> getPermissionById(@PathVariable(name = "project_id") long projectId,
                                                            @PathVariable(name = "id") long permissionId,
                                                            Authentication authentication) {
        PermissionProjection permission = permissionsService.getById(projectId, permissionId, authentication);

        return new Resource<>(permission);
    }

    @PatchMapping(path = "/permissions/{id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus updatePermission(@PathVariable(name = "project_id") long projectId,
                                       @PathVariable(name = "id") long permissionId,
                                       @RequestBody JsonMergePatch patchDto,
                                       Authentication authentication) {
        permissionsService.update(projectId, permissionId, patchDto, authentication);

        return HttpStatus.NO_CONTENT;
    }

    @DeleteMapping("/permissions/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Void> deletePermission(@PathVariable(name = "project_id") long projectId,
                                                 @PathVariable(name = "id") long permissionId,
                                                 Authentication authentication) {
        permissionsService.delete(projectId, permissionId, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
