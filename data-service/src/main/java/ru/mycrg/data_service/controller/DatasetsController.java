package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dao.SchemasDDL;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.datasets.DatasetService;
import ru.mycrg.data_service.service.datasets.IDatasetService;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.OK;

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
    public ResponseEntity<PagedResources<DatasetModel>> getSchemas(
            @RequestParam(required = false, defaultValue = "") String title,
            Authentication authentication,
            Pageable pageable,
            PagedResourcesAssembler pageAssembler) {
        final Page<DatasetModel> datasets = datasetService.getAllByTitle(title, pageable, authentication);

        PagedResources<DatasetModel> pagedResources = pageAssembler.toResource(datasets,
                linkTo(DatasetsController.class)
                        .slash("/api/data/datasets")
                        .withSelfRel());

        return new ResponseEntity<>(pagedResources, OK);
    }

    @GetMapping("/datasets/{dataSetName}")
    public ResponseEntity<Object> getSchema(@PathVariable String dataSetName,
                                            Authentication authentication) {
        if (!schemasDDL.isSchemaExist(dataSetName)) {
            throw new NotFoundException(dataSetName);
        }

        final DatasetModel dto = datasetService.getByName(dataSetName, authentication);

        return ResponseEntity.ok(dto);
    }
}
