package ru.mycrg.data_service.controller.table;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.service.cqrs.tables.requests.UpdateTableSchemaRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class TablesSchemaController {

    private final Mediator mediator;
    private final TableService tableService;

    public TablesSchemaController(Mediator mediator,
                                  TableService tableService) {
        this.mediator = mediator;
        this.tableService = tableService;
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
        mediator.execute(new UpdateTableSchemaRequest(new ResourceQualifier(datasetId, tableId), dto));

        return ResponseEntity.status(OK).build();
    }
}
