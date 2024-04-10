package ru.mycrg.gis_service.controller.geoserver;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping("/{dataStoreName}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> createDataStore(@PathVariable String dataStoreName) {
        dataStoreService.create(dataStoreName);

        return ResponseEntity.status(CREATED).build();
    }

    @DeleteMapping("/{dataStoreName}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteDataStore(@PathVariable String dataStoreName) {
        dataStoreService.delete(dataStoreName);

        return ResponseEntity.status(NO_CONTENT).build();
    }
}
