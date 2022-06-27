package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.import_.ImportService;
import ru.mycrg.data_service.service.import_.Importer;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportRecordReport;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.util.StringUtils.getFilenameExtension;
import static org.springframework.util.StringUtils.isEmpty;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@RestController
public class ImportController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ImportController.class);

    private final List<Importer> importers;
    private final ImportService importService;

    public ImportController(List<Importer> importers,
                            ImportService importService) {
        this.importers = importers;
        this.importService = importService;
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
        Importer importerMp = importers.stream()
                                       .filter(importer -> importType.equalsIgnoreCase(importer.getType()))
                                       .findFirst()
                                       .orElseThrow(() -> new BadRequestException("this importer is not exist"));

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

        Long objectId = (Long) importerMp.doImport(file, table);

        return ResponseEntity.status(OK).body(objectId);
    }

    @PostMapping("/import/excel")
    public ResponseEntity<List<ImportRecordReport>> importExcel(@RequestParam("file") MultipartFile file,
                                                                @RequestParam("libraryId") String libraryId,
                                                                @RequestParam String importType) {
        Importer importerExcel = importers.stream()
                                          .filter(importer -> importType.equalsIgnoreCase(importer.getType()))
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
        List<ImportRecordReport> result = (List<ImportRecordReport>) importerExcel.doImport(file, lQualifier);

        return ResponseEntity.status(CREATED).body(result);
    }
}
