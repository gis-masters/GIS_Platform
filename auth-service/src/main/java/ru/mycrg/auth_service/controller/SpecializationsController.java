package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.common_contracts.generated.Specialization;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class SpecializationsController {

    @GetMapping("/specializations")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<Specialization>> getSpecializations() {
        List<Specialization> specializations = List.of(
                new Specialization(1,
                                   "НТО",
                                   "Описание специализации НТО",
                                   List.of("НТО", "КПТ", "Инвентаризация недвижимости")),
                new Specialization(2,
                                   "Фотофиксация",
                                   "Описание специализации Фотофиксация",
                                   List.of("Фотофиксация")),
                new Specialization(3,
                                   "ГИСОГД",
                                   "Описание специализации ГИСОГД",
                                   List.of("Библиотека", "ГИСОГД", "Приказ 10", "Приказ 123", "Задачи",
                                           "Электронный архив"))
        );

        return ResponseEntity.ok(specializations);
    }
}
