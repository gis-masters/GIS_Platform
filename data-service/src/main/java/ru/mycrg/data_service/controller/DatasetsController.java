package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dao.SchemasDDL;
import ru.mycrg.data_service.dto.DatasetCreateDto;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.datasets.DatasetService;
import ru.mycrg.data_service.service.datasets.IDatasetService;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class DatasetsController {

    public static final Logger log = LoggerFactory.getLogger(DatasetsController.class);

    private final SchemasDDL schemasDDL;
    private final IDatasetService datasetService;

    public DatasetsController(SchemasDDL schemasDDL,
                              DatasetService datasetService) {
        this.schemasDDL = schemasDDL;
        this.datasetService = datasetService;
    }

    @GetMapping("/datasets")
    public ResponseEntity<PagedResources<DatasetModel>> getDatasets(
            @RequestParam(required = false, defaultValue = "") String title,
            Authentication authentication,
            Pageable pageable,
            PagedResourcesAssembler pageAssembler) {
        final Page<DatasetModel> datasets = datasetService.getPaged(title, pageable, authentication);

        PagedResources<DatasetModel> pagedResources = pageAssembler.toResource(
                datasets,
                linkTo(DatasetsController.class)
                        .slash("/api/data/datasets")
                        .withSelfRel());

        return new ResponseEntity<>(pagedResources, OK);
    }

    @GetMapping("/datasets/{dataSetName}")
    public ResponseEntity<DatasetModel> getDataset(@PathVariable String dataSetName,
                                                   Authentication authentication) {
        if (!schemasDDL.isSchemaExist(dataSetName)) {
            throw new NotFoundException(dataSetName);
        }

        final DatasetModel dto = datasetService.getByName(dataSetName, authentication);

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/datasets")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createDataset(@Valid @RequestBody DatasetCreateDto dto,
                                                Authentication authentication) {
        if (schemasDDL.isSchemaExist(dto.getName())) {
            throw new ConflictException("The dataset " + dto.getName() + " already exist");
        }

        DatasetModel newDataset = datasetService.create(dto, authentication);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{dataSetName}")
                .buildAndExpand(newDataset.getResourceIdentifier())
                .toUri();

        return ResponseEntity.created(location).build();
    }
}
