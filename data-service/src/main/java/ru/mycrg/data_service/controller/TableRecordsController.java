package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.table_records.requests.CreateTableRecordRequest;
import ru.mycrg.data_service.service.cqrs.table_records.requests.DeleteTableRecordRequest;
import ru.mycrg.data_service.service.cqrs.table_records.requests.UpdateTableRecordRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.Mediator;

import static org.springframework.http.HttpStatus.CREATED;
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
    @PostMapping("/datasets/{datasetId}/tables/{tableId}/records")
    public ResponseEntity<Feature> createTableRecord(@PathVariable String datasetId,
                                                     @PathVariable String tableId,
                                                     @RequestBody Feature feature) {
        if (feature.isEmpty()) {
            throw new BadRequestException("Пустое тело");
        }

        IResourceModel table = tableService.getInfo(new ResourceQualifier(datasetId, tableId));
        SchemaDto schema = schemaService.getSchemaByName(table.getSchemaId())
                                        .orElseThrow(() -> new NotFoundException(table.getSchemaId()));

        feature.setSrs(table.getCrs());
        schemaService.throwIfNotMathSchema(schema, feature.getProperties());

        Feature newFeature = mediator.execute(
                new CreateTableRecordRequest(schema,
                                             new ResourceQualifier(datasetId, tableId),
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
        schemaService.throwIfNotMathSchema(schema, feature.getProperties());

        mediator.execute(
                new UpdateTableRecordRequest(schema,
                                             new ResourceQualifier(datasetId, tableId, recordId, FEATURE),
                                             feature));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping(path = "/datasets/{datasetId}/tables/{tableId}/records/{recordId}")
    public ResponseEntity<Object> deleteTableRecord(@PathVariable String datasetId,
                                                    @PathVariable String tableId,
                                                    @PathVariable Long recordId) {
        ResourceQualifier tableQualifier = new ResourceQualifier(datasetId, tableId);
        ResourceQualifier recordQualifier = new ResourceQualifier(datasetId, tableId, recordId, FEATURE);

        IResourceModel table = tableService.getInfo(tableQualifier);
        SchemaDto schema = schemaService.getSchemaByName(table.getSchemaId())
                                        .orElseThrow(() -> new NotFoundException(table.getSchemaId()));
        Feature feature = spatialRecordsDao.findById(recordQualifier, schema)
                                           .orElseThrow(() -> new NotFoundException(recordId));

        mediator.execute(
                new DeleteTableRecordRequest(recordQualifier, feature, schema));

        return ResponseEntity.noContent().build();
    }
}
