package ru.mycrg.data_service.controller.table;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.dto.TableUpdateDto;
import ru.mycrg.data_service.service.cqrs.tables.requests.CreateTableRequest;
import ru.mycrg.data_service.service.cqrs.tables.requests.DeleteTableRequest;
import ru.mycrg.data_service.service.cqrs.tables.requests.UpdateTableRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class TablesController {

    private final TableService tableService;
    private final Mediator mediator;

    public TablesController(TableService tableService, Mediator mediator) {
        this.tableService = tableService;
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables")
    public ResponseEntity<?> getTables(@PathVariable String datasetId,
                                       @RequestParam(name = "filter", required = false) String ecqlFilter,
                                       Pageable pageable) {
        Page<TableModel> tables = tableService.getPaged(datasetId, ecqlFilter, pageable);

        return ResponseEntity.ok(pageFromList(tables, pageable));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables/{tableId}")
    public ResponseEntity<?> getTable(@PathVariable String datasetId,
                                      @PathVariable String tableId) {
        TableModel table = tableService.getInfo(new ResourceQualifier(datasetId, tableId));

        return ResponseEntity.ok(table);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/tables")
    public ResponseEntity<TableModel> createTable(@PathVariable String datasetId,
                                                  @Valid @RequestBody TableCreateDto dto) {
        ResourceQualifier tQualifier = new ResourceQualifier(datasetId, dto.getName());

        TableModel tableModel = mediator.execute(new CreateTableRequest(dto, tQualifier));

        return new ResponseEntity<>(tableModel, CREATED);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PutMapping("/datasets/{datasetId}/tables/{tableId}")
    public ResponseEntity<TableModel> updateTable(@PathVariable String datasetId,
                                                  @PathVariable String tableId,
                                                  @Valid @RequestBody TableUpdateDto dto) {
        ResourceQualifier tQualifier = new ResourceQualifier(datasetId, tableId);

        mediator.execute(new UpdateTableRequest(tQualifier, dto));

        return ResponseEntity.ok().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}/tables/{tableId}")
    public ResponseEntity<?> deleteTable(@PathVariable String datasetId,
                                         @PathVariable String tableId) {
        ResourceQualifier rQualifier = new ResourceQualifier(datasetId, tableId);

        mediator.execute(new DeleteTableRequest(rQualifier));

        return ResponseEntity.noContent().build();
    }
}
