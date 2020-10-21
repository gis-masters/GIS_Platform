package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dao.SchemasDDL;
import ru.mycrg.data_service.dao.TablesDDL;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.TableIdentifier;
import ru.mycrg.data_service.service.tables.ITableService;
import ru.mycrg.data_service.service.tables.TableService;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class TablesController {

    public static final Logger log = LoggerFactory.getLogger(TablesController.class);

    private final SchemasDDL schemasDDL;
    private final TablesDDL tablesDDL;
    private final ITableService tableService;

    public TablesController(SchemasDDL schemasDDL,
                            TablesDDL tablesDDL,
                            TableService tableService) {
        this.tablesDDL = tablesDDL;
        this.schemasDDL = schemasDDL;
        this.tableService = tableService;
    }

    @GetMapping("/datasets/{dataSetName}/tables")
    public ResponseEntity<PagedResources<TableModel>> getTables(
            @PathVariable String dataSetName,
            @RequestParam(required = false, defaultValue = "") String title,
            Authentication authentication,
            Pageable pageable,
            PagedResourcesAssembler pageAssembler) {
        if (!schemasDDL.isSchemaExist(dataSetName)) {
            throw new NotFoundException("Not found: " + dataSetName);
        }

        final Page<TableModel> tables = tableService.getAllByTitle(dataSetName, title, pageable, authentication);

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
        if (!schemasDDL.isSchemaExist(dataSetName)) {
            throw new NotFoundException("Not found: " + dataSetName);
        }

        TableIdentifier identifier = new TableIdentifier(dataSetName, tableName);
        if (!tablesDDL.isTableExist(identifier)) {
            throw new NotFoundException("Not found: " + identifier);
        }

        final TableModel dto = tableService.getByName(identifier, authentication);

        return ResponseEntity.ok(dto);
    }
}
