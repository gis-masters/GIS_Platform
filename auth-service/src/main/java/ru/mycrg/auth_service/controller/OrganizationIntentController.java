package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_service.dto.IntentProjection;
import ru.mycrg.auth_service.service.OrganizationIntentService;
import ru.mycrg.auth_service_contract.dto.OrganizationIntentDto;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationIntentController {

    private final OrganizationIntentService intentService;

    public OrganizationIntentController(OrganizationIntentService intentService) {
        this.intentService = intentService;
    }

    @PostMapping("/intents")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> intent(@Valid @RequestBody OrganizationIntentDto intentDto) {
        intentService.addIntent(intentDto);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/intents/{intentToken}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<IntentProjection> getIntentData(@PathVariable String intentToken) {
        IntentProjection intent = intentService.getIntent(intentToken);

        return ResponseEntity.ok(intent);
    }
}
