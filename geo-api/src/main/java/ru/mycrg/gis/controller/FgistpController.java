package ru.mycrg.gis.controller;

import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.exceptions.CrgBadRequestException;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;
import ru.mycrg.gis.service.validation.IValidationService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
public class FgistpController {

    private static Logger log = LoggerFactory.getLogger(FgistpController.class);

    private final FgistpRuleService fgistpRuleService;
    private final IValidationService validationService;

    @Autowired
    public FgistpController(FgistpRuleService fgistpRuleService, IValidationService validationService) {
        this.fgistpRuleService = fgistpRuleService;
        this.validationService = validationService;
    }

    @GetMapping("/fgistp/rules")
    public FgistpRules getRules() {
        log.info("Request /fgistp/rules");

        if (fgistpRuleService.isXsdRulesEmpty()) {
            log.warn("Not found rules in DB. Try generate new from default source.");

            return fgistpRuleService.loadRulesFromXsdSchema();
        } else {
            FgistpRules rules = fgistpRuleService.getRules();

            if (rules.getEntityTypes().isEmpty()) {
                return fgistpRuleService.updateRules();
            } else {
                return rules;
            }
        }
    }

    @GetMapping("/fgistp/rules/update")
    public FgistpRules update() {
        log.info("Request for update rules");

        return fgistpRuleService.updateRules();
    }

    @GetMapping("/fgistp/rules/{className}")
    public EntityType getByName(@PathVariable String className) {
        log.info("Get rule by name: {}", className);

        return fgistpRuleService.getRuleByClassName(className);
    }

    @PostMapping("/fgistp/validation/init")
    public CompletableFuture<ValidationMqResponse> initValidation(
            @RequestBody List<ValidationRequestDto> request,
            Principal principal) {
        log.debug("Init validation for: {} classes", request.size());

        validateRequest(request);

        return validationService.initValidation(principal.getName(), request);
    }

    @PostMapping("/fgistp/validation/info")
    public CompletableFuture<ValidationMqResponse> getCommonInfo(
            @Valid @RequestBody ValidationRequestDto request,
            Principal principal) {
        return validationService.getCommonInfo(principal.getName(), request);
    }

    @PostMapping("/fgistp/validation")
    public CompletableFuture<ValidationMqResponse> getValidationResults(
            @Valid @RequestBody ValidationRequestDto request,
            @RequestParam(required = false, name = "page", defaultValue = "0") String page,
            @RequestParam(required = false, name = "size", defaultValue = "20") String size,
            Principal principal) {
        log.info("Request get validation results: {}/{}", page, size);

        int nPage;
        int nSize;
        try {
            nPage = Integer.parseInt(page);
            nSize = Integer.parseInt(size);
        } catch (NumberFormatException e) {
            throw new CrgBadRequestException(e.getLocalizedMessage());
        }

        return validationService.getResults(request, nPage, nSize, principal.getName());
    }

    private void validateRequest(List<ValidationRequestDto> request) {
        request.forEach(requestDto -> {
            String dbName = requestDto.getDbName();
            String schemaName = requestDto.getSchemaName();
            String tableName = requestDto.getTableName();

            if (Strings.isBlank(dbName) || Strings.isBlank(schemaName) || Strings.isBlank(tableName)) {
                throw new CrgBadRequestException("Incorrect data");
            }
        });
    }

}
