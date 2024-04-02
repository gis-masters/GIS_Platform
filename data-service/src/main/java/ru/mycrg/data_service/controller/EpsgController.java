package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.EpsgModel;
import ru.mycrg.data_service.service.EpsgService;
import ru.mycrg.data_service.validators.ecql.EcqlFilter;

import java.util.ArrayList;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class EpsgController {

    private final EpsgService epsgService;
    private final IAuthenticationFacade authenticationFacade;

    public EpsgController(EpsgService epsgService, IAuthenticationFacade authenticationFacade) {
        this.epsgService = epsgService;
        this.authenticationFacade = authenticationFacade;
    }

    @GetMapping("/epsg")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAll(@RequestParam(name = "filter", required = false) @EcqlFilter String ecqlFilter,
                                         Pageable pageable) {
        Page<EpsgModel> knownEpsg = authenticationFacade.isOrganizationAdmin()
                ? epsgService.getAll(ecqlFilter, pageable)
                : new PageImpl<>(new ArrayList<>(), pageable, 0);

        return ResponseEntity.ok(pageFromList(knownEpsg, pageable));
    }
}
