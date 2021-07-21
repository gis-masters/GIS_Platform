package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.import_.ImportGml;
import ru.mycrg.data_service.service.import_.ImportService;
import ru.mycrg.data_service.service.import_.Importer;
import ru.mycrg.data_service.service.parsers.model.ImportReport;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.ACCEPTED;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class ImportController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(ImportController.class);
    private static final String APPLICATION_GML_XML = "application/gml+xml";
    private static final String GML_XML = "gml+xml";

    private final List<Importer> importers;
    private final ImportService importService;
    private final ImportGml importGml;

    public ImportController(List<Importer> importers,
                            ImportService importService,
                            ImportGml importGml) {
        this.importers = importers;
        this.importService = importService;
        this.importGml = importGml;
    }

    @PostMapping("/import/{projectId}")
    public ResponseEntity<Process> initImport(@PathVariable long projectId,
                                              @Valid @RequestBody WorkImport workImport) {
        Process process = importService.initProcess(projectId, workImport.getTargetSchema(), workImport);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), ACCEPTED);
    }

    @PostMapping("/import/file")
    public ResponseEntity<Long> importXmlFileToDb(@RequestParam String datasetId,
                                                  @RequestParam String tableId,
                                                  @RequestParam("file") MultipartFile file,
                                                  @RequestParam String importType) {
        Importer importMp = importers.stream()
                                     .filter(importer -> importType.equalsIgnoreCase(importer.getType()))
                                     .findFirst()
                                     .orElseThrow(() -> new BadRequestException("this importer is not exist"));
        if (file.isEmpty()) {
            String msg = "Загружаемый файл пустой";
            log.warn(msg);

            throw new BadRequestException(msg);
        } else if (!MediaType.APPLICATION_XML_VALUE.equals(file.getContentType())
                && !MediaType.TEXT_XML_VALUE.equals(file.getContentType())) {
            String msg = "Тип файла не XML";
            log.warn(msg);

            throw new BadRequestException(msg);
        }

        ResourceQualifier table = new ResourceQualifier(datasetId, tableId);

        Long objectId = importMp.doImport(file, table);

        return ResponseEntity.status(OK).body(objectId);
    }

    @PostMapping("/import/file/gml")
    public ResponseEntity<ImportReport> importGmlFileToDb(@RequestParam("file") MultipartFile file,
                                                          @RequestParam("title") String title) {

        if (file.isEmpty()) {
            String msg = "Загружаемый файл пустой";
            log.warn(msg);

            throw new BadRequestException(msg);
        } else if (!APPLICATION_GML_XML.equals(file.getContentType())
                && !GML_XML.equals(file.getContentType())) {
            String msg = "Тип файла не GML";
            log.warn(msg);

            throw new BadRequestException(msg);
        }

        if (title.length() > 250) {
            String msg = "Поле title не должно превышать 250 символов";
            log.warn(msg);

            throw new BadRequestException(msg);
        }

        ImportReport importReport = importGml.doImport(file, title);

        return ResponseEntity.status(OK).body(importReport);
    }
}
