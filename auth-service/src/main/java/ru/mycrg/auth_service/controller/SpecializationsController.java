package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_service.service.SpecializationService;
import ru.mycrg.common_contracts.generated.Specialization;

import java.util.List;

@RestController
public class SpecializationsController {

    private final SpecializationService specializationService;

    public SpecializationsController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<Specialization>> getSpecializations() {
        List<Specialization> specializations = specializationService.getAllSpecializations();

        return ResponseEntity.ok(specializations);
    }
}
