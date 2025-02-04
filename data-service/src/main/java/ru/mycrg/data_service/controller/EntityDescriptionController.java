package ru.mycrg.data_service.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.EntityDescriptionService;
import ru.mycrg.schemas.entity.EntityDescriptionResponseModel;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class EntityDescriptionController {

    private final EntityDescriptionService entityDescriptionService;

    public EntityDescriptionController(EntityDescriptionService entityDescriptionService) {
        this.entityDescriptionService = entityDescriptionService;
    }

    @GetMapping("/entities-description")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public List<EntityDescriptionResponseModel> getDescriptions(
            @RequestParam(name = "tableNames") List<String> tableNames) {
        return entityDescriptionService.getDescriptions(tableNames);
    }
}
