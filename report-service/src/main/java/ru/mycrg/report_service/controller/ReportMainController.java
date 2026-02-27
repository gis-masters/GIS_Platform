package ru.mycrg.report_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;
import ru.mycrg.report_service.config.custom_annotation.RequiresCarboneHealth;
import ru.mycrg.report_service.exceptions.BadRequestException;
import ru.mycrg.report_service.services.IReportService;

import javax.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping(value = "/reports")
public class ReportMainController {

    private final IReportService reportService;

    public ReportMainController(IReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @RequiresCarboneHealth
    public ResponseEntity<UUID> createReport(@Valid @RequestBody ReportMainDto dto) {

        throwIfInvalid(dto);

        UUID fileUuid = reportService.makeReport(dto);

        return ResponseEntity.ok(fileUuid);
    }

    private void throwIfInvalid(ReportMainDto dto) {
        if (dto == null || dto.getOutputFormat() == null) {
            throw new BadRequestException("Поле outputFormat обязательно для заполнения");
        }

        if (dto.getData() == null && dto.getMedia() == null) {
            throw new BadRequestException("Поля Data или media обязательный для заполнения");
        }
    }
}
