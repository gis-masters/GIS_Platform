package ru.mycrg.gis_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.gis_service.dto.DatasetCreateDto;
import ru.mycrg.gis_service.service.DatasetService;

import javax.validation.Valid;

import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class DatasetsController {

    private final DatasetService datasetService;

    public DatasetsController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PostMapping("/projects/datasets")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createDataset(@Valid @RequestBody DatasetCreateDto dto,
                                                Authentication authentication) {
        datasetService.create(dto, authentication);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
