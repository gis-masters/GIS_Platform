package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.service.resources.DatasetService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class DatasetsController {

    private final DatasetService datasetService;

    public DatasetsController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets")
    public ResponseEntity<Object> getDatasets(@RequestParam(required = false, defaultValue = "") String title,
                                              Pageable pageable,
                                              PagedResourcesAssembler<IResourceModel> pageAssembler) {
        final Page<IResourceModel> datasets = datasetService.getPaged(title, pageable);

        var pagedResources = pageAssembler.toResource(
                datasets,
                linkTo(DatasetsController.class)
                        .slash("/api/data/datasets")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}")
    public ResponseEntity<IResourceModel> getDataset(@PathVariable String datasetId) {
        final IResourceModel dto = datasetService.getInfo(datasetId);

        return ResponseEntity.ok(dto);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets")
    public ResponseEntity<Object> createDataset(@Valid @RequestBody ResourceCreateDto dto) {
        IResourceModel newDataset = datasetService.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{datasetId}")
                .buildAndExpand(newDataset.getIdentifier())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}")
    public ResponseEntity<Object> deleteDataset(@PathVariable String datasetId) {
        datasetService.delete(new ResourceQualifier(datasetId));

        return ResponseEntity.noContent().build();
    }
}
