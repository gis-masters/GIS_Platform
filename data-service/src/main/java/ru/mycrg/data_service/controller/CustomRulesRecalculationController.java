package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service_contract.dto.ResourceQualifierDto;
import ru.mycrg.data_service.service.schemas.CustomRulesRecalculationService;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping("/rules-recalculation")
public class CustomRulesRecalculationController {

    private final CustomRulesRecalculationService customRulesRecalculationService;

    /**
     * Весь контроллер это костыль для пересчёта правил после нечестного добавления данных в таблицу на прямую через БД.
     * На данный момент код больше не считает ruleID используя JavaScript, логика перенесена на уровень БД и зашита
     * при создании таблиц по схемама как Generated Always as. По сути можно удалить весь mvc путь. На данный момент
     * нет мест, где бы этот код правда применялся и был бы важен.
     */
    public CustomRulesRecalculationController(CustomRulesRecalculationService customRulesRecalculationService) {
        this.customRulesRecalculationService = customRulesRecalculationService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping
    public ResponseEntity<Object> recalculate(@RequestBody List<ResourceQualifierDto> resourceQualifiers) {
        customRulesRecalculationService.recalculate(resourceQualifiers);

        return ResponseEntity.ok().build();
    }
}
