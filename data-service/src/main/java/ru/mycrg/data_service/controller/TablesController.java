package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.tables.ITableService;
import ru.mycrg.data_service.service.tables.TableService;

import javax.validation.Valid;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@RestController
public class TablesController {

    public static final Logger log = LoggerFactory.getLogger(TablesController.class);

    private final ITableService tableService;

    public TablesController(TableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping("/datasets/{dataSetName}/tables")
    public ResponseEntity<TableModel> createTable(@PathVariable String dataSetName,
                                                  @Valid @RequestBody ResourceCreateDto dto,
                                                  Authentication authentication) {
        ResourceIdentifier datasetId = new ResourceIdentifier(dataSetName, SCHEMA);
        ResourceIdentifier tableId = new ResourceIdentifier(dto.getName(), TABLE, datasetId);

        TableModel tableModel = tableService.create(tableId, dto, authentication);

        return new ResponseEntity<>(tableModel, CREATED);
    }

    @GetMapping("/datasets/{dataSetName}/tables")
    public ResponseEntity<PagedResources<TableModel>> getTables(
            @PathVariable String dataSetName,
            @RequestParam(required = false, defaultValue = "") String title,
            Authentication authentication,
            Pageable pageable,
            PagedResourcesAssembler pageAssembler) {
        final Page<TableModel> tables = tableService.getPaged(dataSetName, title, pageable, authentication);

        PagedResources<TableModel> pagedResources = pageAssembler.toResource(tables,
                linkTo(TablesController.class)
                        .slash("/api/data/datasets/" + dataSetName + "/tables")
                        .withSelfRel());

        return new ResponseEntity<>(pagedResources, OK);
    }

    @GetMapping("/datasets/{dataSetName}/tables/{tableName}")
    public ResponseEntity<Object> getTable(@PathVariable String dataSetName,
                                           @PathVariable String tableName,
                                           Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableName, TABLE,
                                                                new ResourceIdentifier(dataSetName, SCHEMA));

        final TableModel dto = tableService.getByIdentifier(rIdentifier, authentication);

        return ResponseEntity.ok(dto);
    }
}
