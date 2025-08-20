package ru.mycrg.data_service.controller.table;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.cqrs.schema_comparator.SchemaTableComparator;
import ru.mycrg.data_service.service.cqrs.tables.requests.UpdateTableSchemaRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class TablesSchemaController {

    private final Mediator mediator;
    private final TableService tableService;
    private final SchemaTableComparator schemaTableComparator;

    public TablesSchemaController(Mediator mediator,
                                  TableService tableService,
                                  SchemaTableComparator schemaTableComparator) {
        this.mediator = mediator;
        this.tableService = tableService;
        this.schemaTableComparator = schemaTableComparator;
    }

    @PostMapping("/tablesSchemas")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Map<String, SchemaDto>> getSchemas(@RequestBody List<String> tableIdentifiers) {
        Map<String, SchemaDto> schemas = tableService.getSchemas(tableIdentifiers);

        return ResponseEntity.ok(schemas);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables/{tableId}/schema")
    public ResponseEntity<SchemaDto> getTableSchema(@PathVariable String datasetId,
                                                    @PathVariable String tableId) {
        SchemaDto schema = tableService.getSchema(new ResourceQualifier(datasetId, tableId));

        return ResponseEntity.ok(schema);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PutMapping("/datasets/{datasetId}/tables/{tableId}/schema")
    public ResponseEntity<?> updateTableSchema(@PathVariable String datasetId,
                                               @PathVariable String tableId,
                                               @Valid @RequestBody SchemaDto dto) {
        ResourceQualifier qualifier = new ResourceQualifier(datasetId, tableId);

        Set<ErrorInfo> mismatches = schemaTableComparator.comparate(dto, qualifier);
        if (!mismatches.isEmpty()) {
            throw new BadRequestException("Найдено не соответствие схемы и таблицы", new ArrayList<>(mismatches));
        }

        mediator.execute(new UpdateTableSchemaRequest(qualifier, dto));

        return ResponseEntity.status(OK).build();
    }
}
