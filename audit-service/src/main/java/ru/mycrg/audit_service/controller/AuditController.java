package ru.mycrg.audit_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.audit_service.dto.EventFullProjection;
import ru.mycrg.audit_service.service.AuditEventService;
import ru.mycrg.audit_service_contract.dto.AuditEventDto;

import java.net.URI;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED;
import static ru.mycrg.audit_service.security.AuthenticationFacade.HAS_ANY_AUTHORITY;

@RestController
public class AuditController {

    private final AuditEventService auditEventService;
    private final PagedResourcesAssembler<EventFullProjection> assembler;

    public AuditController(AuditEventService auditEventService,
                           PagedResourcesAssembler<EventFullProjection> assembler) {
        this.auditEventService = auditEventService;
        this.assembler = assembler;
    }

    @PostMapping(value = "/events")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<EventFullProjection> addEvent(@Validated @RequestBody AuditEventDto auditEventDto) {
        EventFullProjection newEvent = auditEventService.addEvent(auditEventDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(newEvent.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity<>(headers, CREATED);
    }

    @GetMapping(value = "/events")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAllEvents(Pageable pageable) {
        Page<EventFullProjection> events = auditEventService.getAllEvents(pageable);

        return ResponseEntity.ok(assembler.toResource(events));
    }

    @PutMapping(value = "/events/{id}")
    public ResponseEntity<Object> updatePutEvents() {
        return new ResponseEntity<>(METHOD_NOT_ALLOWED);
    }

    @PatchMapping(value = "/events/{id}")
    public ResponseEntity<Object> updatePatchEvents() {
        return new ResponseEntity<>(METHOD_NOT_ALLOWED);
    }

    @DeleteMapping(value = "/events/{id}")
    public ResponseEntity<Object> deleteEvents() {
        return new ResponseEntity<>(METHOD_NOT_ALLOWED);
    }
}
