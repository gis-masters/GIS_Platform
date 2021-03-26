package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
public class SchemasController {

    public static final Logger log = LoggerFactory.getLogger(SchemasController.class);

    private final SchemaService schemaService;

    public SchemasController(SchemaService schemaService) {
        this.schemaService = schemaService;
    }

    @GetMapping("/schemas")
    @PreAuthorize("isAuthenticated()")
    public List<SchemaDto> getSchemas(@RequestParam(name = "schemaIds") List<String> schemaIds) {
        return schemaService.getSchemas(schemaIds);
    }

    @PostMapping("/schemas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> createSchema(@RequestBody SchemaDto schemaDto) {
        schemaService.create(schemaDto);

        return ResponseEntity.status(CREATED).build();
    }
}
