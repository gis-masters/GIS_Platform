package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.entity.EpsgModel;
import ru.mycrg.data_service.service.EpsgService;
import ru.mycrg.data_service.validators.ecql.EcqlFilter;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class EpsgController {

    private final EpsgService epsgService;

    public EpsgController(EpsgService epsgService) {
        this.epsgService = epsgService;
    }

    @GetMapping("/epsg")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAll(@RequestParam(name = "filter", required = false) @EcqlFilter String ecqlFilter,
                                         Pageable pageable,
                                         PagedResourcesAssembler<EpsgModel> pageAssembler) {
        Page<EpsgModel> epsg = epsgService.getAll(ecqlFilter, pageable);

        var pagedResources = pageAssembler.toResource(epsg, linkTo(EpsgController.class).slash("/epsg").withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }
}
