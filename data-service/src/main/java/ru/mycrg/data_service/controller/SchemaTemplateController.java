package ru.mycrg.data_service.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common_contracts.generated.data_service.SchemaTemplateProjection;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.CreateSchemaTemplateRequest;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.UpdateSchemaTemplateRequest;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.DeleteSchemaTemplateRequest;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import java.util.List;

import static org.springframework.http.HttpStatus.*;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class SchemaTemplateController {

    private final Mediator mediator;
    private final ISchemaTemplateService schemaTemplateService;

    public SchemaTemplateController(Mediator mediator,
                                    ISchemaTemplateService schemaTemplateService) {
        this.mediator = mediator;
        this.schemaTemplateService = schemaTemplateService;
    }

    @GetMapping("/schemasTemplate")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<SchemaTemplateProjection>> getSchemaTemplates(@RequestParam List<String> schemaIds) {
        return ResponseEntity.ok((schemaTemplateService.getSchemaTemplatesProjection(schemaIds)));
    }

    @GetMapping("/schemas")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<SchemaDto>> getSchemaDto(@RequestParam List<String> schemaIds) {

        return ResponseEntity.ok(schemaTemplateService.getSchemas(schemaIds));
    }

    @GetMapping("/schemas/tags")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<String>> getSystemTags() {
        List<String> systemTags = schemaTemplateService.getSystemTags();

        return ResponseEntity.ok(systemTags);
    }

    @GetMapping("/reglaments_schemas")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public List<SchemaDto> getSchemaTemplatesWithReglaments() {
        return schemaTemplateService.getSchemasWithReglaments();
    }

    @PostMapping("/schemas")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> createSchemaTemplate(@Valid @RequestBody SchemaDto schemaDto) {
        mediator.execute(new CreateSchemaTemplateRequest(schemaDto));

        return ResponseEntity.status(CREATED).build();
    }

    @PutMapping("/schemas")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updateSchemaTemplate(@Valid @RequestBody SchemaDto schemaDto) {
        mediator.execute(new UpdateSchemaTemplateRequest(schemaDto));

        return ResponseEntity.status(OK).build();
    }

    @DeleteMapping("/schemas/{name}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteSchemaTemplate(@NotBlank @PathVariable String name) {
        mediator.execute(new DeleteSchemaTemplateRequest(name));

        return ResponseEntity.status(NO_CONTENT).build();
    }
}
