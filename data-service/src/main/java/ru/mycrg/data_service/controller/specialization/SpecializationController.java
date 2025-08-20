package ru.mycrg.data_service.controller.specialization;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common_contracts.generated.specialization.TableContentModel;
import ru.mycrg.data_service.service.cqrs.specialization.requests.GetSpecializationResourcesRequest;
import ru.mycrg.data_service.service.cqrs.specialization.requests.InitSpecializationRequest;
import ru.mycrg.data_service.service.cqrs.specialization.requests.InitSpecializationSchemaRequest;
import ru.mycrg.mediator.Mediator;

import java.util.Set;

import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class SpecializationController {

    private final Mediator mediator;

    public SpecializationController(Mediator mediator) {
        this.mediator = mediator;
    }

    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    @GetMapping("/specializations/{id}")
    public ResponseEntity<Set<String>> getSpecializationResources(@PathVariable Integer id) {
        Set<String> resources = mediator.execute(
                new GetSpecializationResourcesRequest(id));

        return ResponseEntity.ok(resources);
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @PostMapping("/specializations/{id}/datasetsInit")
    public ResponseEntity<?> initSpecialization(@PathVariable Integer id,
                                                @RequestBody TableContentModel tableContentModel) {
        mediator.execute(
                new InitSpecializationRequest(id, tableContentModel));

        return ResponseEntity.ok().build();
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @PostMapping("/specializations/{id}/schemasInit")
    public ResponseEntity<?> initSpecializationSchema(@PathVariable Integer id) {
        mediator.execute(
                new InitSpecializationSchemaRequest(id));

        return ResponseEntity.ok().build();
    }
}
