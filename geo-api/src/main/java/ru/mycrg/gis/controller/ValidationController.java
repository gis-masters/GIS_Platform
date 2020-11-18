package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.ExportResourceModel;
import ru.mycrg.gis.dto.ValidationInfo;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.BadRequestException;
import ru.mycrg.gis.service.validation.ValidationService;
import ru.mycrg.gis.service.validation.ViolationService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
public class ValidationController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(ValidationController.class);

    private final ValidationService validationService;
    private final ViolationService violationService;

    public ValidationController(ValidationService validationService,
                                ViolationService violationService) {
        this.validationService = validationService;
        this.violationService = violationService;
    }

    @PostMapping("/validation")
    public ResponseEntity<Process> initValidation(@Valid @RequestBody ValidationRequestDto dto,
                                                  Principal principal) {
        log.debug("Init validation for: {} resources", dto.getResources().size());

        Process process = validationService.validate(dto, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/validation/results")
    public ResponseEntity<ValidationResponseDto> getValidationResults(
            @RequestParam(required = false, name = "page", defaultValue = "0") String page,
            @RequestParam(required = false, name = "size", defaultValue = "25") String size,
            @Valid @RequestBody ExportResourceModel dto,
            Principal principal) {

        // TODO: Use "org.springframework.data.domain.Pageable;" instead manual
        int nPage;
        int nSize;
        try {
            nPage = Integer.parseInt(page);
            nSize = Integer.parseInt(size);
        } catch (NumberFormatException e) {
            throw new BadRequestException(e.getLocalizedMessage());
        }

        ValidationResponseDto result = violationService.getViolations(dto, nPage, nSize, principal);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/validation/short")
    public ResponseEntity<List<ValidationInfo>> getValidationInfo(@Valid @RequestBody ValidationRequestDto request,
                                                                  Principal principal) {
        log.debug("Request get short validation info");

        List<ValidationInfo> result = violationService.getShortInfo(request, principal);

        return ResponseEntity.ok(result);
    }
}
