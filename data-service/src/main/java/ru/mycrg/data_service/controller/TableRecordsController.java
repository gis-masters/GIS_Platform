package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.table_records.requests.*;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.Mediator;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;
import static ru.mycrg.data_service.dto.ResourceType.FEATURE;

@RestController
public class TableRecordsController {

    private final Mediator mediator;
    private final TableService tableService;
    private final SchemaService schemaService;
    private final SpatialRecordsDao spatialRecordsDao;

    public TableRecordsController(Mediator mediator,
                                  TableService tableService,
                                  SchemaService schemaService,
                                  SpatialRecordsDao spatialRecordsDao) {
        this.mediator = mediator;
        this.tableService = tableService;
        this.schemaService = schemaService;
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables/{tableId}/records/{recordIds}")
    public ResponseEntity<List<Feature>> getTableRecords(@PathVariable String datasetId,
                                                         @PathVariable String tableId,
                                                         @PathVariable List<Long> recordIds) {
        ResourceQualifier qualifier = new ResourceQualifier(datasetId, tableId);

        IResourceModel table = tableService.getInfo(qualifier);
        SchemaDto schema = schemaService.getSchemaByName(table.getSchemaId())
                                        .orElseThrow(() -> new NotFoundException(table.getSchemaId()));

        List<Feature> features = spatialRecordsDao.findByIds(qualifier, schema, recordIds);

        return new ResponseEntity<>(features, OK);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/tables/{tableId}/records")
    public ResponseEntity<Feature> createTableRecord(@PathVariable String datasetId,
                                                     @PathVariable String tableId,
                                                     @RequestBody Feature feature) {
        ResourceQualifier resourceQualifier = new ResourceQualifier(datasetId, tableId);

        IResourceModel table = tableService.getInfo(resourceQualifier);
        SchemaDto schema = schemaService.getSchemaByName(table.getSchemaId())
                                        .orElseThrow(() -> new NotFoundException(table.getSchemaId()));

        feature.setSrs(table.getCrs());
        Map<String, Object> props = schemaService.excludeUnknownProperties(schema, feature.getProperties());
        feature.setProperties(props);

        Feature newFeature = mediator.execute(
                new CreateTableRecordRequest(schema,
                                             resourceQualifier,
                                             feature));

        return new ResponseEntity<>(newFeature, CREATED);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PatchMapping(path = "/datasets/{datasetId}/tables/{tableId}/records/{recordId}",
                  consumes = APPLICATION_JSON_MERGE_PATCH)
    public ResponseEntity<Object> updateTableRecord(@PathVariable String datasetId,
                                                    @PathVariable String tableId,
                                                    @PathVariable Long recordId,
                                                    @RequestBody Feature feature) {
        IResourceModel table = tableService.getInfo(new ResourceQualifier(datasetId, tableId));
        SchemaDto schema = schemaService.getSchemaByName(table.getSchemaId())
                                        .orElseThrow(() -> new NotFoundException(table.getSchemaId()));
        Map<String, Object> props = schemaService.excludeUnknownProperties(schema, feature.getProperties());

        feature.setSrs(table.getCrs());
        feature.setProperties(props);

        mediator.execute(
                new UpdateTableRecordRequest(schema,
                                             new ResourceQualifier(datasetId, tableId, recordId, FEATURE),
                                             feature));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PatchMapping(path = "/datasets/{datasetId}/tables/{tableId}/records-multiple/{recordIds}",
                  consumes = APPLICATION_JSON_MERGE_PATCH)
    public ResponseEntity<Object> updateMultipleTableRecord(@PathVariable String datasetId,
                                                            @PathVariable String tableId,
                                                            @PathVariable List<Long> recordIds,
                                                            @RequestBody Map<String, Object> properties) {
        IResourceModel table = tableService.getInfo(new ResourceQualifier(datasetId, tableId));
        SchemaDto schema = schemaService.getSchemaByName(table.getSchemaId())
                                        .orElseThrow(() -> new NotFoundException(table.getSchemaId()));
        Map<String, Object> props = schemaService.excludeUnknownProperties(schema, properties);

        mediator.execute(
                new UpdateMultipleTableRecordRequest(new ResourceQualifier(datasetId, tableId),
                                                     props,
                                                     schema,
                                                     recordIds));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping(path = "/datasets/{datasetId}/tables/{tableId}/records/{recordIds}")
    public ResponseEntity<Object> deleteSeveralTableRecords(@PathVariable String datasetId,
                                                            @PathVariable String tableId,
                                                            @PathVariable List<Long> recordIds) {
        ResourceQualifier tableQualifier = new ResourceQualifier(datasetId, tableId);

        if (recordIds.size() == 1) {
            ResourceQualifier recordQualifier = new ResourceQualifier(datasetId, tableId, recordIds.get(0), FEATURE);

            IResourceModel table = tableService.getInfo(tableQualifier);
            SchemaDto schema = schemaService.getSchemaByName(table.getSchemaId())
                                            .orElseThrow(() -> new NotFoundException(table.getSchemaId()));
            Feature feature = spatialRecordsDao.findById(recordQualifier, schema)
                                               .orElseThrow(() -> new NotFoundException(recordIds.get(0)));

            mediator.execute(new DeleteTableRecordRequest(recordQualifier, feature, schema));
        } else {
            mediator.execute(new DeleteMultipleTableRecordsRequest(tableQualifier, recordIds));
        }

        return ResponseEntity.noContent().build();
    }
}
