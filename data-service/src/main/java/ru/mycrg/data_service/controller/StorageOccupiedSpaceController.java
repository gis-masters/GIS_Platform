package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.storage.FileStorageService;

import java.util.Map;

import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class StorageOccupiedSpaceController {

    private final FileStorageService fileStorageService;

    public StorageOccupiedSpaceController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/storage/occupied")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> getOccupiedSpace() {
        Map<String, Object> result = fileStorageService.occupiedSpace();

        return ResponseEntity.status(OK)
                             .body(result);
    }
}
