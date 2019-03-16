package ru.mycrg.gis.controller;

import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.enums.RequstType;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.exceptions.CrgBadRequestException;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;
import ru.mycrg.gis.service.gml.GmlService;
import ru.mycrg.gis.service.validation.IValidationService;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
public class FgistpController {

    private static Logger log = LoggerFactory.getLogger(FgistpController.class);

    private final FgistpRuleService fgistpRuleService;
    private final IValidationService validationService;
    private final GmlService gmlService;

    @Autowired
    public FgistpController(FgistpRuleService fgistpRuleService,
                            IValidationService validationService,
                            GmlService gmlService) {
        this.fgistpRuleService = fgistpRuleService;
        this.validationService = validationService;
        this.gmlService = gmlService;
    }

    @GetMapping("/fgistp/rules")
    public FgistpRules getRules() {
        log.debug("Request /fgistp/rules");

        if (fgistpRuleService.isCacheEmpty()) {
            return fgistpRuleService.updateRules();
        } else {
            return fgistpRuleService.getRules();
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
    public CompletableFuture<List<ValidationResponseDto>> initValidation(
            @RequestBody List<ValidationRequestDto> request,
            Principal principal) {
        log.debug("Init validation for: {} classes", request.size());

        validateRequest(request);

        return validationService.initProcess(principal.getName(), request, 0, 25, RequstType.INIT);
    }

    @PostMapping("/fgistp/validation/info")
    public CompletableFuture<List<ValidationResponseDto>> getCommonInfo(
            @RequestBody List<ValidationRequestDto> request,
            Principal principal) {
        validateRequest(request);

        return validationService.initProcess(principal.getName(), request, 0, 25, RequstType.INFO);
    }

    @PostMapping("/fgistp/validation")
    public CompletableFuture<List<ValidationResponseDto>> getValidationResults(
            @RequestBody List<ValidationRequestDto> request,
            @RequestParam(required = false, name = "page", defaultValue = "0") String page,
            @RequestParam(required = false, name = "size", defaultValue = "25") String size,
            Principal principal) {
        log.info("Request get validation results: {}/{}", page, size);

        validateRequest(request);

        int nPage;
        int nSize;
        try {
            nPage = Integer.parseInt(page);
            nSize = Integer.parseInt(size);
        } catch (NumberFormatException e) {
            throw new CrgBadRequestException(e.getLocalizedMessage());
        }

        return validationService.initProcess(principal.getName(), request, nPage, nSize, RequstType.GET);
    }

    @ResponseBody
    @PostMapping("/fgistp/export/gml")
    public CompletableFuture<GmlMqResponse> gmlGeneration(@RequestBody GmlRequestDto request) {
        log.debug("Gml generation request");

        return gmlService.initProcess(request);
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
