package ru.mycrg.gis_service.controller.geoserver;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.service.geoserver.DataStoreService;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping(value = "/geoserver/datastores")
public class DataStoreController {

    private final DataStoreService dataStoreService;

    public DataStoreController(DataStoreService dataStoreService) {
        this.dataStoreService = dataStoreService;
    }

    @PostMapping("/{dataStoreId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> createDataStore(@PathVariable String dataStoreId) {
        dataStoreService.create(dataStoreId);

        return ResponseEntity.status(CREATED).build();
    }

    @DeleteMapping("/{dataStoreId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteDataStore(@PathVariable String dataStoreId) {
        dataStoreService.delete(dataStoreId);

        return ResponseEntity.status(NO_CONTENT).build();
    }
}
