package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.import_.ImportMp;
import ru.mycrg.data_service.service.import_.ImportService;
import ru.mycrg.data_service.service.import_.Importer;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class ImportController extends BaseController {

    private final Importer importer;
    private final ImportService importService;

    private static final Logger log = LoggerFactory.getLogger(ImportController.class);

    public ImportController(ImportMp importer, ImportService importService) {
        this.importer = importer;
        this.importService = importService;
    }

    @PostMapping("/import/{projectId}")
    public ResponseEntity<Process> initImport(@PathVariable long projectId,
                                              @Valid @RequestBody WorkImport workImport) {
        Process process = importService.initProcess(projectId, workImport.getTargetSchema(), workImport);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/import/file")
    public ResponseEntity<Integer> importXmlFileToDb(@RequestParam String datasetId,
                                                     @RequestParam String tableId,
                                                     @RequestParam("file") MultipartFile file) {
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

        ResourceIdentifier table = new ResourceIdentifier(tableId, ResourceType.TABLE, datasetId, ResourceType.SCHEMA);

        Integer objectId = importer.doImport(file, table);

        return ResponseEntity.status(OK).body(objectId);
    }
}
