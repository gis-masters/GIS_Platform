package ru.mycrg.data_service.controller.dataset;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.ResourceUpdateDto;
import ru.mycrg.data_service.service.cqrs.datasets.requests.CreateDatasetRequest;
import ru.mycrg.data_service.service.cqrs.datasets.requests.DeleteDatasetRequest;
import ru.mycrg.data_service.service.cqrs.datasets.requests.UpdateDatasetRequest;
import ru.mycrg.data_service.service.resources.DatasetService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.net.URI;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class DatasetsController {

    private final DatasetService datasetService;
    private final Mediator mediator;

    public DatasetsController(DatasetService datasetService, Mediator mediator) {
        this.datasetService = datasetService;
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets")
    public ResponseEntity<Object> getDatasets(@RequestParam(name = "filter", required = false) String ecqlFilter,
                                              Pageable pageable) {
        Page<IResourceModel> datasets = datasetService.getPaged(ecqlFilter, pageable);

        return ResponseEntity.ok(pageFromList(datasets, pageable));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}")
    public ResponseEntity<IResourceModel> getDataset(@PathVariable String datasetId) {
        IResourceModel dataset = datasetService.getInfo(datasetId);

        return ResponseEntity.ok(dataset);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets")
    public ResponseEntity<IResourceModel> createDataset(@Valid @RequestBody ResourceCreateDto dto) {
        IResourceModel newDataset = mediator.execute(new CreateDatasetRequest(dto));

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{datasetId}")
                .buildAndExpand(newDataset.getIdentifier())
                .toUri();

        return ResponseEntity.created(location).body(newDataset);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PatchMapping("/datasets/{datasetId}")
    public ResponseEntity<Object> updateDataset(@PathVariable String datasetId,
                                                @Valid @RequestBody ResourceUpdateDto dto) {

        ResourceQualifier dQualifier = new ResourceQualifier(datasetId);

        mediator.execute(new UpdateDatasetRequest(dQualifier, dto));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}")
    public ResponseEntity<Object> deleteDataset(@PathVariable String datasetId) {
        mediator.execute(new DeleteDatasetRequest(new ResourceQualifier(datasetId)));

        return ResponseEntity.noContent().build();
    }
}
