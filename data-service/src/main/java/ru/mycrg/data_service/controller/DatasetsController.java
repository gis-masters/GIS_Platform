package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.service.datasets.DatasetService;
import ru.mycrg.data_service.service.datasets.IDatasetService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;

@RestController
public class DatasetsController {

    public static final Logger log = LoggerFactory.getLogger(DatasetsController.class);

    private final IDatasetService datasetService;

    public DatasetsController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @GetMapping("/datasets")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getDatasets(@RequestParam(required = false, defaultValue = "") String title,
                                              Authentication authentication,
                                              Pageable pageable,
                                              PagedResourcesAssembler<IResourceModel> pageAssembler) {
        final Page<IResourceModel> datasets = datasetService.getPaged(title, pageable, authentication);

        var pagedResources = pageAssembler.toResource(
                datasets,
                linkTo(DatasetsController.class)
                        .slash("/api/data/datasets")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/datasets/{datasetId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<IResourceModel> getDataset(@PathVariable String datasetId,
                                                     Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(datasetId, SCHEMA);
        final IResourceModel dto = datasetService.getInfo(rIdentifier, authentication);

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/datasets")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> createDataset(@Valid @RequestBody ResourceCreateDto dto,
                                                Authentication authentication) {
        IResourceModel newDataset = datasetService.create(dto, authentication);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{datasetId}")
                .buildAndExpand(newDataset.getIdentifier())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @DeleteMapping("/datasets/{datasetId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteDataset(@PathVariable String datasetId, Authentication authentication) {
        datasetService.delete(new ResourceIdentifier(datasetId, SCHEMA), authentication);

        return ResponseEntity.noContent().build();
    }
}
