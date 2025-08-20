package ru.mycrg.data_service.controller.reestr;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common_contracts.generated.page.PageableResources;
import ru.mycrg.data_service.dto.reestrs.ReestrProjection;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.cqrs.reestrs.requests.CreateReestrRecordRequest;
import ru.mycrg.data_service.service.reestrs.ReestrService;
import ru.mycrg.data_service.service.reestrs.ReestrsService;
import ru.mycrg.data_service.validators.ecql.EcqlFilter;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.mediator.Mediator;

import java.util.*;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.excludeUnknownProperties;

@RestController
public class ReestrsController {

    private final Mediator mediator;
    private final ReestrService reestrService;
    private final ReestrsService reestrsService;
    private final OrgSettingsKeeper orgSettingsKeeper;

    public ReestrsController(Mediator mediator,
                             ReestrService reestrService,
                             ReestrsService reestrsService,
                             OrgSettingsKeeper orgSettingsKeeper) {
        this.mediator = mediator;
        this.reestrService = reestrService;
        this.reestrsService = reestrsService;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @GetMapping("/reestrs")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<PageableResources<ReestrProjection>> getReestrs(Pageable pageable) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        Page<ReestrProjection> reestrs = reestrsService.getAll(pageable);

        return ResponseEntity.ok(pageFromList(reestrs, pageable));
    }

    @GetMapping("/reestrs/schemas")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<SchemaDto> getReestrsSchemas() {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        SchemaDto schema = reestrsService.getSchema();

        return ResponseEntity.ok(schema);
    }

    @GetMapping("/reestrs/{tableName}/schemas")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<SchemaDto> getReestrSchema(@PathVariable String tableName) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        SchemaDto schema = reestrsService.getSchema(tableName);

        return ResponseEntity.ok(schema);
    }

    @GetMapping("/reestrs/{tableName}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<ReestrProjection> getReestrInfo(@PathVariable String tableName) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        ReestrProjection reestrProjection = reestrsService.get(tableName);

        return ResponseEntity.ok(reestrProjection);
    }

    @GetMapping("/reestrs/{tableName}/records")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getReestrData(@PathVariable String tableName,
                                                @RequestParam(required = false) @EcqlFilter String filter,
                                                Pageable pageable) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        Page<Map<String, Object>> result = reestrsService.getAll(tableName, pageable, filter);

        return ResponseEntity.ok(pageFromList(result, pageable));
    }

    @GetMapping("/reestrs/{tableName}/records/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Map<String, Object>> getReestrRecordById(@PathVariable String tableName,
                                                                   @PathVariable UUID id) {
        orgSettingsKeeper.throwIfReestrsNotAllowed();

        Map<String, Object> result = reestrService.getById(tableName, id);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/reestrs/{tableName}/records")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> create(@PathVariable String tableName,
                                         @RequestBody Map<String, Object> body) {
        SchemaDto schema = reestrsService.getSchema(tableName);
        Map<String, Object> props = excludeUnknownProperties(schema, body);

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
