package ru.mycrg.data_service.controller.reestr;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common_contracts.page.PageableResources;
import ru.mycrg.data_service.controller.dataset.DatasetsController;
import ru.mycrg.data_service.dto.RecordDto;
import ru.mycrg.data_service.dto.reestrs.ReestrProjection;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.reestrs.requests.CreateReestrRecordRequest;
import ru.mycrg.data_service.service.reestrs.ReestrService;
import ru.mycrg.data_service.validators.ecql.EcqlFilter;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.mediator.Mediator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class ReestrsController {

    private final Mediator mediator;
    private final ReestrService reestrService;
    private final SchemaService schemaService;
    private final OrgSettingsKeeper orgSettingsKeeper;

    public ReestrsController(Mediator mediator,
                             ReestrService reestrService,
                             SchemaService schemaService,
                             OrgSettingsKeeper orgSettingsKeeper) {
        this.mediator = mediator;
        this.reestrService = reestrService;
        this.schemaService = schemaService;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @GetMapping("/reestrs")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<PageableResources<ReestrProjection>> getReestrs(Pageable pageable) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        Page<ReestrProjection> reestrs = reestrService.getAll(pageable);

        return ResponseEntity.ok(pageFromList(reestrs, pageable));
    }

    @GetMapping("/reestrs/schemas")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<SchemaDto> getReestrsSchemas() {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        SchemaDto schema = reestrService.getSchema();

        return ResponseEntity.ok(schema);
    }

    @GetMapping("/reestrs/{tableName}/schemas")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<SchemaDto> getReestrSchema(@PathVariable String tableName) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        SchemaDto schema = reestrService.getSchema(tableName);

        return ResponseEntity.ok(schema);
    }

    @GetMapping("/reestrs/{tableName}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getReestrData(@PathVariable String tableName,
                                                @RequestParam(required = false) @EcqlFilter String filter,
                                                Pageable pageable,
                                                PagedResourcesAssembler<RecordDto> pageAssembler) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        Page<RecordDto> result = reestrService.getAll(tableName, pageable, filter);

        var pagedResources = pageAssembler.toResource(
                result,
                linkTo(DatasetsController.class)
                        .slash("reestrs/" + tableName)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PostMapping("/reestrs/{tableName}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> create(@PathVariable String tableName,
                                         @RequestBody Map<String, Object> body) {
        SchemaDto schema = reestrService.getSchema(tableName);
        Map<String, Object> props = schemaService.excludeUnknownProperties(schema, body);

        validateRequired(schema.getProperties(), props);

        IRecord record = mediator.execute(
                new CreateReestrRecordRequest(tableName, schema, new RecordEntity(props)));

        return new ResponseEntity<>(record.getContent(), CREATED);
    }

    private void validateRequired(List<SimplePropertyDto> props,
                                  Map<String, Object> data) {
        Map<String, String> result = new HashMap<>();

        props.forEach(prop -> {
            if (prop.isRequired() != null && prop.isRequired() && !data.containsKey(prop.getName().toLowerCase())) {
                result.put(prop.getName(), "Обязательно к заполнению");
            }
        });

        if (!result.isEmpty()) {
            List<ErrorInfo> errors = new ArrayList<>();
            result.forEach((k, v) -> {
                ErrorInfo errorInfo = new ErrorInfo();
                errorInfo.setField(k);
                errorInfo.setMessage("Поле обязательно к заполнению");

                errors.add(errorInfo);
            });

            throw new BadRequestException("Некорректный запрос", errors);
        }
    }
}
