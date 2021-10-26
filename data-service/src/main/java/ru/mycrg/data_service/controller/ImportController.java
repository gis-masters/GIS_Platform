package ru.mycrg.data_service.controller;

import org.apache.commons.io.FilenameUtils;
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

import javax.validation.Valid;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.springframework.http.HttpStatus.ACCEPTED;
import static org.springframework.http.HttpStatus.OK;

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
        Importer importMp = importers.stream()
                                     .filter(importer -> importType.equalsIgnoreCase(importer.getType()))
                                     .findFirst()
                                     .orElseThrow(() -> new BadRequestException("this importer is not exist"));

        String filename = file.getOriginalFilename();
        String fileExtension = FilenameUtils.getExtension(filename);

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

        Long objectId = importMp.doImport(file, table);

        return ResponseEntity.status(OK).body(objectId);
    }
}
