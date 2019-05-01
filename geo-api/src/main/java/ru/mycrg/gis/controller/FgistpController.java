package ru.mycrg.gis.controller;

import org.apache.logging.log4j.util.Strings;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.exceptions.CrgBadRequestException;
import ru.mycrg.gis.exceptions.FileNotFoundException;
import ru.mycrg.gis.service.GmlStorageService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;
import ru.mycrg.gis.service.gml.GmlGenerationService;
import ru.mycrg.gis.service.validation.ValidationService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;
import java.util.concurrent.CompletableFuture;

@RestController
public class FgistpController {

    private static Logger log = LoggerFactory.getLogger(FgistpController.class);

    private final FgistpRuleService fgistpRuleService;
    private final ValidationService validationService;
    private final GmlGenerationService gmlGenerationService;
    private final GmlStorageService gmlStorageService;

    @Autowired
    public FgistpController(FgistpRuleService fgistpRuleService,
                            ValidationService validationService,
                            GmlStorageService gmlStorageService,
                            GmlGenerationService gmlGenerationService) {
        this.fgistpRuleService = fgistpRuleService;
        this.validationService = validationService;
        this.gmlStorageService = gmlStorageService;
        this.gmlGenerationService = gmlGenerationService;
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

        return fgistpRuleService.getRuleByName(className);
    }

    @PostMapping("/fgistp/validation/init")
    public CompletableFuture<BaseMqProcessResponse> initValidation(
            @RequestBody ValidationRequestDto request,
            Principal principal) {
        log.debug("Init validation for: {} resources", request.getResources().size());

        validateRequest(request);

        return validationService.validate(principal.getName(), request);
    }

    @PostMapping("/fgistp/validation/info")
    public CompletableFuture<BaseMqProcessResponse> getCommonInfo(
            @RequestBody ValidationRequestDto request,
            Principal principal) {
        validateRequest(request);

        return validationService.getInfo(principal.getName(), request);
    }

    @PostMapping("/fgistp/validation")
    public CompletableFuture<BaseMqProcessResponse> getValidationResults(
            @RequestBody ValidationRequestDto request,
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

        return validationService.getResult(principal.getName(), request, nPage, nSize);
    }

    @ResponseBody
    @PostMapping("/fgistp/export/gml")
    public CompletableFuture<BaseMqProcessResponse> gmlGeneration(@RequestBody GmlRequestDto request) {
        log.debug("Gml generation request");

        return gmlGenerationService.initProcess(request);
    }

    /**
     * Если есть пустые/незаполненные параметры(хотябы у одного) - считаем это некорректной работой UI.
     */
    private void validateRequest(ValidationRequestDto request) {
        request.getResources().forEach(requestDto -> {
            String dbName = requestDto.getDbName();
            String schemaName = requestDto.getSchemaName();
            String tableName = requestDto.getTableName();

            if (Strings.isBlank(dbName) || Strings.isBlank(schemaName) || Strings.isBlank(tableName)) {
                throw new CrgBadRequestException("Incorrect data: " + String.join(".", dbName, schemaName, tableName));
            }
        });
    }

    @GetMapping("/fgistp/export/gml/{fileName:.+}")
    public ResponseEntity<Resource> download(@PathVariable String fileName, HttpServletRequest request) {
        log.debug("Request to download file: {}", fileName);

        Resource res = gmlStorageService.load(fileName);

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(determinateContentType(request, res)))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + res.getFilename() + "\"")
                .body(res);
    }

    @NotNull
    private String determinateContentType(@NotNull HttpServletRequest request, @NotNull Resource resource) {
        String contentType;
        try {
            String absolutePath = resource.getFile().getAbsolutePath();
            contentType = request.getServletContext().getMimeType(absolutePath);
        } catch (IOException e) {
            throw  new FileNotFoundException("Wrong file URL");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return contentType;
    }

}
