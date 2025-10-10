package ru.mycrg.data_service.controller.table;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.cqrs.tables.requests.UpdateTableSchemaRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.schemas.SchemaLogicValidator;
import ru.mycrg.data_service.service.schemas.SchemaTableComparator;
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
    private final SchemaLogicValidator schemaLogicValidator;
    private final SchemaTableComparator schemaTableComparator;

    public TablesSchemaController(Mediator mediator,
                                  TableService tableService, SchemaLogicValidator schemaLogicValidator,
                                  SchemaTableComparator schemaTableComparator) {
        this.mediator = mediator;
        this.tableService = tableService;
        this.schemaLogicValidator = schemaLogicValidator;
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
                                               @Valid @RequestBody SchemaDto newSchema) {
        ResourceQualifier qualifier = new ResourceQualifier(datasetId, tableId);

        Set<ErrorInfo> mismatches = schemaTableComparator.comparate(newSchema, qualifier);
        if (!mismatches.isEmpty()) {
            throw new BadRequestException("Найдено не соответствие схемы и таблицы", new ArrayList<>(mismatches));
        }

        Set<ErrorInfo> validationMismatches = schemaLogicValidator.validate(newSchema);
        if (!validationMismatches.isEmpty()) {
            throw new BadRequestException("В схеме найдены ошибки", new ArrayList<>(validationMismatches));
        }

        mediator.execute(new UpdateTableSchemaRequest(qualifier, newSchema));

        return ResponseEntity.status(OK).build();
    }
}
