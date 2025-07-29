package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.cqrs.srs.requests.AddCustomSrsRequest;
import ru.mycrg.data_service.service.cqrs.srs.requests.DeleteCustomSrsRequest;
import ru.mycrg.data_service.service.cqrs.srs.requests.UpdateCustomSrsRequest;
import ru.mycrg.data_service.service.srs.SpatialReferenceSystemService;
import ru.mycrg.data_service.validators.ecql.EcqlFilter;
import ru.mycrg.mediator.Mediator;

import java.util.ArrayList;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class SpatialReferenceSystemController {

    private final Mediator mediator;
    private final SpatialReferenceSystemService srsService;
    private final IAuthenticationFacade authenticationFacade;

    public SpatialReferenceSystemController(Mediator mediator,
                                            SpatialReferenceSystemService srsService,
                                            IAuthenticationFacade authenticationFacade) {
        this.mediator = mediator;
        this.srsService = srsService;
        this.authenticationFacade = authenticationFacade;
    }

    @GetMapping("/srs")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAllSrs(
            @RequestParam(name = "filter", required = false) @EcqlFilter String ecqlFilter,
            Pageable pageable) {
        Page<SpatialReferenceSystem> knownSrs = !authenticationFacade.isRoot()
                ? srsService.getAll(ecqlFilter, pageable)
                : new PageImpl<>(new ArrayList<>(), pageable, 0);

        return ResponseEntity.ok(pageFromList(knownSrs, pageable));
    }

    @PostMapping("/srs")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> addSrs(@RequestBody SpatialReferenceSystem srsDto) {
        validateSrs(srsDto);

        SpatialReferenceSystem newSrs = mediator.execute(new AddCustomSrsRequest(srsDto));

        return ResponseEntity.ok(newSrs);
    }

    @PatchMapping("/srs/{authSrid}")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<SpatialReferenceSystem> updateSrs(@PathVariable @NotNull Integer authSrid,
                                                            @RequestBody SpatialReferenceSystem srsDto) {
        validateSrs(srsDto);

        SpatialReferenceSystem newSrs = mediator.execute(new UpdateCustomSrsRequest(authSrid, srsDto));

        return ResponseEntity.ok(newSrs);
    }

    @DeleteMapping("/srs/{authSrid}")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteSrs(@PathVariable Integer authSrid) {
        mediator.execute(new DeleteCustomSrsRequest(authSrid));

        return ResponseEntity.noContent().build();
    }

    private static void validateSrs(SpatialReferenceSystem srs) {
        if (srs.getSrtext() == null) {
            throw new BadRequestException("Не задан обязательный параметр: srtext");
        }

        if (!srs.getSrtext().matches("(?i).*DATUM\\s*\\[.*TOWGS84\\s*\\[.*")) {
            throw new BadRequestException("Не задано обязательное значение: TOWGS84");
        }
    }
}
