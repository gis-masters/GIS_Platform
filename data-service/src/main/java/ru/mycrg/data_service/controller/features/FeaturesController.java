package ru.mycrg.data_service.controller.features;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.resources.features.IFeaturesReader;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.tableQualifier;

@RestController
public class FeaturesController {

    private final TableService tableService;
    private final IFeaturesReader featuresReader;

    public FeaturesController(TableService tableService,
                              IFeaturesReader featuresReader) {
        this.tableService = tableService;
        this.featuresReader = featuresReader;
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
}