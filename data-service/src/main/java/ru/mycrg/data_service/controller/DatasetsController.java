package ru.mycrg.data_service.controller;

import io.swagger.annotations.ApiOperation;
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
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
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

    private final IDatasetService datasetService;

    public DatasetsController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @GetMapping("/datasets")
    public ResponseEntity<PagedResources<IResourceModel>> getDatasets(
            @RequestParam(required = false, defaultValue = "") String title,
            Authentication authentication,
            Pageable pageable,
            PagedResourcesAssembler pageAssembler) {
        final Page<IResourceModel> datasets = datasetService.getPaged(title, pageable, authentication);

        PagedResources<IResourceModel> pagedResources = pageAssembler.toResource(
                datasets,
                linkTo(DatasetsController.class)
                        .slash("/api/data/datasets")
                        .withSelfRel());

        return new ResponseEntity<>(pagedResources, OK);
    }

    @GetMapping("/datasets/{dataSetName}")
    public ResponseEntity<IResourceModel> getDataset(@PathVariable String dataSetName,
                                                    Authentication authentication) {
        final IResourceModel dto = datasetService.getByName(dataSetName, authentication);

        return ResponseEntity.ok(dto);
    }

    @ApiOperation(value = "Создание нового набора данных. ВНИМАНИЕ НЕ использовать напрямую!",
                  notes = "Корректный эндпоинт для создания находится в gis-service, вызов которого выполнит " +
                          "необходимые действия на геосервере и 'дёрнет' данный эндпоинт")
    @PostMapping("/datasets")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createDataset(@Valid @RequestBody ResourceCreateDto dto,
                                                Authentication authentication) {
        IResourceModel newDataset = datasetService.create(dto, authentication);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{dataSetName}")
                .buildAndExpand(newDataset.getIdentifier())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @ApiOperation(value = "Удаление набора данных. ВНИМАНИЕ НЕ использовать напрямую!",
                  notes = "Корректный эндпоинт для удаления находится в gis-service, вызов которого выполнит " +
                          "необходимые действия на геосервере и 'дёрнет' данный эндпоинт")
    @DeleteMapping("/datasets/{datasetId}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteDataset(@PathVariable String datasetId, Authentication authentication) {
        datasetService.delete(datasetId);

        return ResponseEntity.noContent().build();
    }
}
