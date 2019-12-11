package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common.ValidationInfo;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.CrgBadRequestException;
import ru.mycrg.gis.service.validation.ValidationService;
import ru.mycrg.gis.service.validation.ViolationService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/projects")
public class ValidationController extends BaseController {

    private static Logger log = LoggerFactory.getLogger(ValidationController.class);

    private final ValidationService validationService;
    private final ViolationService violationService;

    public ValidationController(ValidationService validationService,
                                ViolationService violationService) {
        this.validationService = validationService;
        this.violationService = violationService;
    }

    @PostMapping("/{projectId}/validation")
    public ResponseEntity<Process> initValidation(@PathVariable Long projectId,
                                                  @Valid @RequestBody ValidationRequestDto request,
                                                  Principal principal) {
        log.debug("Init validation for: {} resources", request.getLayers().size());

        Process process = validationService.validate(projectId, principal, request);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{projectId}/validation")
    public ResponseEntity<ValidationResponseDto> getValidationResults(
            @PathVariable Long projectId,
            @RequestParam String layerName,
            @RequestParam(required = false, name = "page", defaultValue = "0") String page,
            @RequestParam(required = false, name = "size", defaultValue = "25") String size,
            Principal principal) {
        log.info("Request get validation results for layer: {} - {}/{}", layerName, page, size);

        int nPage;
        int nSize;
        try {
            nPage = Integer.parseInt(page);
            nSize = Integer.parseInt(size);
        } catch (NumberFormatException e) {
            throw new CrgBadRequestException(e.getLocalizedMessage());
        }

        ValidationResponseDto result = violationService.getViolations(principal, projectId, layerName, nPage, nSize);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{projectId}/validation/short")
    public ResponseEntity<List<ValidationInfo>> getValidationInfo(@PathVariable Long projectId,
                                                                  @Valid @RequestBody ValidationRequestDto request,
                                                                  Principal principal) {
        log.debug("Request get short validation info");

        List<ValidationInfo> result = violationService.getShortInfo(principal, projectId, request);

        return ResponseEntity.ok(result);
    }

}
