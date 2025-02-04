package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.service.EntityPropertiesService;
import ru.mycrg.data_service.validators.EntityPropertyValidator;
import ru.mycrg.schemas.IEntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;

import javax.validation.Valid;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class EntityPropertiesController {

    private final EntityPropertyValidator entityPropertyValidator;
    private final EntityPropertiesService entityPropertiesService;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(entityPropertyValidator);
    }

    public EntityPropertiesController(EntityPropertyValidator entityPropertyValidator,
                                      EntityPropertiesService entityPropertiesService) {
        this.entityPropertyValidator = entityPropertyValidator;
        this.entityPropertiesService = entityPropertiesService;
    }

    @GetMapping("/entity-properties")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAll(Pageable pageable) {
        Page<EntityPropertyResponseModel> properties = entityPropertiesService.getPaged(pageable);

        return ResponseEntity.ok(pageFromList(properties, pageable));
    }

    @PostMapping("/entity-properties")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> create(@Valid @RequestBody IEntityProperty entityProperty) {
        final EntityPropertyResponseModel newProperty = entityPropertiesService.create(entityProperty);

        return ResponseEntity.ok(newProperty);
    }
}
