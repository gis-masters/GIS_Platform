package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_service.service.specialization.SpecializationMapper;
import ru.mycrg.auth_service.service.specialization.SpecializationService;
import ru.mycrg.common_contracts.generated.specialization.SpecializationView;
import ru.mycrg.common_contracts.specialization.Specialization;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class SpecializationsController {

    private final SpecializationService specializationService;

    public SpecializationsController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<SpecializationView>> getSpecializations() {
        List<SpecializationView> specializations = specializationService
                .getAllSpecializations().stream()
                .map(SpecializationMapper::mapToCompact)
                .collect(Collectors.toList());

        return ResponseEntity.ok(specializations);
    }

    @GetMapping("/specializations/{id}")
    public ResponseEntity<Specialization> getSpecializationById(@PathVariable Integer id) {
        Specialization specialization = specializationService.getSpecialization(id);

        return ResponseEntity.ok(specialization);
    }
}
