package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.storage.StorageOccupiedSpaceService;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;

@RestController
public class CacheController extends BaseController {

    private final StorageOccupiedSpaceService occupiedSpaceService;

    public CacheController(StorageOccupiedSpaceService occupiedSpaceService) {
        this.occupiedSpaceService = occupiedSpaceService;
    }

    @GetMapping("/cacheInfo")
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    public ResponseEntity<?> getCacheInfo() {
        return ResponseEntity.ok().body(occupiedSpaceService.getInfo());
    }
}
