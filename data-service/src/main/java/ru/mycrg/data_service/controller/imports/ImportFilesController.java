package ru.mycrg.data_service.controller.imports;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.controller.BaseController;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.import_.Importer;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportRecordReport;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.util.StringUtils.getFilenameExtension;
import static org.springframework.util.StringUtils.isEmpty;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@RestController
public class ImportFilesController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ImportFilesController.class);

    private final List<Importer> importers;

    public ImportFilesController(List<Importer> importers) {
        this.importers = importers;
    }

    @PostMapping("/import/file")
    public ResponseEntity<Long> importFile(@RequestParam String datasetId,
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

        List<ImportRecordReport> result = (List<ImportRecordReport>) eImporter
                .doImport(file, libraryQualifier(libraryId));

        return ResponseEntity.status(CREATED).body(result);
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
