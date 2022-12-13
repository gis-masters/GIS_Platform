package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.schemas.requests.CreateSchemaRequest;
import ru.mycrg.data_service.service.cqrs.schemas.requests.UpdateSchemaRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;

@RestController
public class SchemasController {

    private final Mediator mediator;
    private final SchemaService schemaService;

    public SchemasController(Mediator mediator,
                             SchemaService schemaService) {
        this.mediator = mediator;
        this.schemaService = schemaService;
    }

    @GetMapping("/schemas")
    @PreAuthorize("isAuthenticated()")
    public List<SchemaDto> getSchemas(@RequestParam(name = "schemaIds") List<String> schemaIds) {
        return schemaService.getSchemas(schemaIds);
    }

    @GetMapping("/reglaments_schemas")
    @PreAuthorize("isAuthenticated()")
    public List<SchemaDto> getSchemasWithReglaments() {
        return schemaService.getSchemasWithReglaments();
    }

    @PostMapping("/schemas")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createSchema(@Valid @RequestBody SchemaDto schemaDto) {
        mediator.execute(new CreateSchemaRequest(schemaDto));

        return ResponseEntity.status(CREATED).build();
    }

    @PutMapping("/schemas")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateSchema(@Valid @RequestBody SchemaDto schemaDto) {
        mediator.execute(new UpdateSchemaRequest(schemaDto));

        return ResponseEntity.status(OK).build();
    }
}
