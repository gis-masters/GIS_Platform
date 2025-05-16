package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.CreateSchemaTemplateRequest;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.UpdateSchemaTemplateRequest;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;

@RestController
public class SchemaTemplateController {

    private final Mediator mediator;
    private final ISchemaTemplateService schemaTemplateService;

    public SchemaTemplateController(Mediator mediator,
                                    ISchemaTemplateService schemaTemplateService) {
        this.mediator = mediator;
        this.schemaTemplateService = schemaTemplateService;
    }

    @GetMapping("/schemas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SchemaDto>> getSchemaTemplates(@RequestParam List<String> schemaIds) {

        return ResponseEntity.ok(schemaTemplateService.getSchemas(schemaIds));
    }

    @GetMapping("/schemas/tags")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getSystemTags() {
        List<String> systemTags = schemaTemplateService.getSystemTags();

        return ResponseEntity.ok(systemTags);
    }

    @GetMapping("/reglaments_schemas")
    @PreAuthorize("isAuthenticated()")
    public List<SchemaDto> getSchemaTemplatesWithReglaments() {
        return schemaTemplateService.getSchemasWithReglaments();
    }

    @PostMapping("/schemas")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createSchemaTemplate(@Valid @RequestBody SchemaDto schemaDto) {
        mediator.execute(new CreateSchemaTemplateRequest(schemaDto));

        return ResponseEntity.status(CREATED).build();
    }

    @PutMapping("/schemas")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateSchemaTemplate(@Valid @RequestBody SchemaDto schemaDto) {
        mediator.execute(new UpdateSchemaTemplateRequest(schemaDto));

        return ResponseEntity.status(OK).build();
    }
}
