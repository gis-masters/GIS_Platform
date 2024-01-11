package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.Resource;
import ru.mycrg.data_service.service.PermissionsService;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class PermissionController {

    private final PermissionsService permissionsService;

    public PermissionController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @GetMapping("/all-permissions")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getAllPermissions(Pageable pageable) {
        Page<Resource> permissions = permissionsService.getAll(pageable);

        return ResponseEntity.ok(pageFromList(permissions, pageable));
    }
}
