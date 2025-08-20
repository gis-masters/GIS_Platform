package ru.mycrg.data_service.controller.features;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.common_contracts.generated.data_service.GeometryValidationResultDto;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.resources.features.IFeaturesReader;
import ru.mycrg.data_service.service.cqrs.features.requests.MakeGeometryValidRequest;
import ru.mycrg.data_service.service.cqrs.features.requests.CheckGeometryValidRequest;
import ru.mycrg.mediator.Mediator;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.tableQualifier;

@RestController
public class FeaturesController {

    private final TableService tableService;
    private final IFeaturesReader featuresReader;
    private final Mediator mediator;

    public FeaturesController(TableService tableService,
                              IFeaturesReader featuresReader,
                              Mediator mediator) {
        this.tableService = tableService;
        this.featuresReader = featuresReader;
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables/{tableId}/records")
    public ResponseEntity<?> getTableRecords(@PathVariable String datasetId,
                                             @PathVariable String tableId,
                                             @RequestParam(name = "filter", required = false)
                                             String ecqlFilter,
                                             Pageable pageable) {
        ResourceQualifier tableQualifier = tableQualifier(datasetId, tableId);

        IResourceModel table = tableService.getInfo(tableQualifier);
        SchemaDto schema = table.getSchema();
        if (schema == null) {
            throw new NotFoundException("Не найдена схема таблицы: " + tableQualifier.getQualifier());
        }

        Page<Feature> features = featuresReader.getAll(tableQualifier, schema, ecqlFilter, pageable);

        return ResponseEntity.ok(pageFromList(features, pageable));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/makeGeometryValid")
    public ResponseEntity<Feature> makeGeometryValid(@Valid @NotNull @RequestBody Feature feature) {
        Feature validFeature = mediator.execute(new MakeGeometryValidRequest(feature));

        return ResponseEntity.ok(validFeature);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/checkGeometryValid")
    public ResponseEntity<GeometryValidationResultDto> checkGeometryValid(
            @Valid @NotNull @RequestBody Feature feature,
            @NotNull @RequestParam String epsg) {
        GeometryValidationResultDto validFeature = mediator.execute(new CheckGeometryValidRequest(feature, epsg));

        return ResponseEntity.ok(validFeature);
    }
}
