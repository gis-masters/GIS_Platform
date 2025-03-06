package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.export.Exporter;
import ru.mycrg.data_service.service.export.LayerValidationReportService;
import ru.mycrg.data_service.service.storage.FileStorageService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.ACCEPTED;

// TODO: в будущем вернуться к врапперу. пока как есть
@RestController
public class ExportController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ExportController.class);

    private final List<Exporter> exporters;
    private final FileStorageService fileStorageService;
    private final LayerValidationReportService reporter;

    @Autowired
    public ExportController(FileStorageService fileStorageService,
                            LayerValidationReportService reporter,
                            List<Exporter> exporters) {
        this.fileStorageService = fileStorageService;
        this.reporter = reporter;
        this.exporters = exporters;
    }

    @PostMapping("/export")
    public ResponseEntity<Process> exportProjectLayers(@Valid @RequestBody ExportRequestModel dto) {
        Process process = exporters
                .stream()
                .filter(ex -> ex.getType().getType().equalsIgnoreCase(dto.getFormat()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Нет обработчика для формата: " + dto.getFormat()))
                .doExport(dto);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), ACCEPTED);
    }

    @PostMapping("/export/validation_results")
    public ResponseEntity<Process> exportValidationResults(@Valid @RequestBody ValidationRequestDto dto) {
        log.debug("Request to download validation results file with: {}", dto.getResources());

        Process process = reporter.generateReport(dto);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), ACCEPTED);
    }

    @GetMapping("/export/{fileName:.+}")
    public ResponseEntity<Resource> download(@PathVariable String fileName, HttpServletRequest request) {
        log.debug("Request to download file: {}", fileName);

        Resource res = fileStorageService.loadFromExportStorage(fileName);

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
            log.error("Wrong file URL", e);

            throw new NotFoundException("Wrong file URL", e.getCause());
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return contentType;
    }
}
