package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.TableDto;
import ru.mycrg.data_service.service.TableService;

@RestController
public class TablesController {

    private final TableService tableService;

    public TablesController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping("/schemas/{schemaName}/tables")
    public ResponseEntity<Object> getTablesInfo(@PathVariable String schemaName,
                                                Authentication authentication,
                                                Pageable pageable) {
        Page<TableDto> tables = tableService.getTables(schemaName, authentication, pageable);

        return ResponseEntity.ok(tables);
    }

    @GetMapping("/schemas/{schemaName}/tables/{tableName}")
    public ResponseEntity<Object> getTableInfo(@PathVariable String schemaName,
                                               @PathVariable String tableName,
                                               Authentication authentication) {
        TableDto byName = tableService.getByName(authentication, schemaName, tableName);

        return ResponseEntity.ok(byName);
    }

}
