package ru.mycrg.gis_service.controller.specialization;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.service.specialization.SpecializationService;

import java.util.Map;
import java.util.Set;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class SpecializationController {

    private final SpecializationService specializationService;

    public SpecializationController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    @GetMapping("/specializations/{id}")
    public ResponseEntity<Set<String>> getSpecializationResources(@PathVariable Integer id) {
        Set<String> resources = specializationService.getResources(id);

        return ResponseEntity.ok(resources);
    }

    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    @PostMapping("/specializations/{id}")
    public ResponseEntity<?> initSpecialization(@PathVariable Integer id,
                                                @RequestBody(required = false) Map<String, String> params) {
        specializationService.initSpecialization(id,
                                                 params == null ? Map.of() : params);

        return ResponseEntity.ok().build();
    }
}
