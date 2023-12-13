package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.dto.kpt_import.KptImportXmlRequest;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.queue.handlers.KptImportXmlHandler;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskStatusRequest;
import ru.mycrg.data_service.service.import_.ImportService;
import ru.mycrg.data_service.service.import_.Importer;
import ru.mycrg.data_service.service.import_.kpt.KptImportXmlRequestService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportRecordReport;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.util.StringUtils.getFilenameExtension;
import static org.springframework.util.StringUtils.isEmpty;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service_contract.enums.TaskStatus.CANCELED;

@RestController
public class ImportController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ImportController.class);

    private final List<Importer> importers;
    private final ImportService importService;
    private final KptImportXmlRequestService kptImportXmlRequestService;
    private final KptImportXmlHandler kptImportXmlHandler;
    private final Mediator mediator;

    public ImportController(List<Importer> importers,
                            ImportService importService,
                            KptImportXmlRequestService kptImportXmlRequestService,
                            KptImportXmlHandler kptImportXmlHandler,
                            Mediator mediator) {
        this.importers = importers;
        this.importService = importService;
        this.kptImportXmlRequestService = kptImportXmlRequestService;
        this.kptImportXmlHandler = kptImportXmlHandler;
        this.mediator = mediator;
    }

    @PostMapping("/import/{projectId}")
    public ResponseEntity<Process> initImport(@PathVariable long projectId,
                                              @Valid @RequestBody WorkImport workImport) {
        Process process = importService.initProcess(projectId, workImport.getTargetSchema(), workImport);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), ACCEPTED);
    }

    @PostMapping("/import/file")
    public ResponseEntity<Long> importXml(@RequestParam String datasetId,
                                          @RequestParam String tableId,
                                          @RequestParam("file") MultipartFile file,
                                          @RequestParam String importType) {
        throwIfEmpty(datasetId, tableId, importType);

        Importer fImporter = importers
                .stream()
                .filter(importer -> importer.getType().name().equalsIgnoreCase(importType))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Задан некорректный тип импорта: " + importType));

        String filename = file.getOriginalFilename();
        String fileExtension = getFilenameExtension(filename);

        if (file.isEmpty()) {
            String msg = "Загружаемый файл пустой";
            log.warn(msg);

            throw new BadRequestException(msg);
        } else if (isEmpty(fileExtension) || !"xml".equalsIgnoreCase(fileExtension)) {
            String msg = "Тип файла не XML";
            log.warn(msg);

            throw new BadRequestException(msg);
        }

        ResourceQualifier table = new ResourceQualifier(datasetId, tableId);

        Long objectId = (Long) fImporter.doImport(file, table);

        return ResponseEntity.status(OK).body(objectId);
    }

    @PostMapping("/import/excel")
    public ResponseEntity<List<ImportRecordReport>> importExcel(@RequestParam("file") MultipartFile file,
                                                                @RequestParam("libraryId") String libraryId,
                                                                @RequestParam String importType) {
        Importer eImporter = importers.stream()
                                      .filter(importer -> importer.getType().name().equalsIgnoreCase(importType))
                                      .findFirst()
                                      .orElseThrow(() -> new BadRequestException("this importer is not exist"));

        String filename = file.getOriginalFilename();
        String fileExtension = getFilenameExtension(filename);

        if (isEmpty(fileExtension) || !"xlsx".equalsIgnoreCase(fileExtension)) {
            String msg = "Тип файла не Excel";
            log.warn(msg);

            throw new BadRequestException(msg);
        }
        ResourceQualifier lQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryId, LIBRARY);
        List<ImportRecordReport> result = (List<ImportRecordReport>) eImporter.doImport(file, lQualifier);

        return ResponseEntity.status(CREATED).body(result);
    }

    @PostMapping("/import/kpt")
    public ResponseEntity<Object> importKpt(@RequestBody @Valid KptImportXmlRequest request) {
        return ResponseEntity.status(ACCEPTED).body(kptImportXmlRequestService.initImport(request));
    }

    @PostMapping("/import/kpt/{taskId}/cancel")
    public ResponseEntity<Void> cancelKptImport(@PathVariable @NotNull Long taskId) {
        kptImportXmlHandler.cancelImport();
        mediator.execute(new UpdateTaskStatusRequest(CANCELED, taskId));
        return ResponseEntity.ok().build();
    }

    private void throwIfEmpty(String datasetId, String tableId, String importType) {
        if (datasetId.isEmpty()) {
            throw new BadRequestException("не задан набор данных: " + datasetId);
        }

        if (tableId.isEmpty()) {
            throw new BadRequestException("Не задана таблица: " + tableId);
        }

        if (importType.isEmpty()) {
            throw new BadRequestException("Не задан тип импорта: " + importType);
        }
    }
}
