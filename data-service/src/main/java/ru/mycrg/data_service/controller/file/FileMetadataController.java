package ru.mycrg.data_service.controller.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.common_contracts.generated.data_service.FileMetadata;
import ru.mycrg.data_service.controller.BaseController;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.files.IMetadataExtractor;
import ru.mycrg.data_service.service.files.MetadataExtractionException;
import ru.mycrg.data_service.service.resources.protectors.IFileResourceProtector;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.files.IMetadataExtractor.DEFAULT_TYPE;

@RestController
@RequestMapping("/files")
public class FileMetadataController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(FileMetadataController.class);

    private final FileRepository fileRepository;
    private final IFileResourceProtector fileResourceProtector;
    private final Map<String, IMetadataExtractor> metadataExtractors;

    public FileMetadataController(FileRepository fileRepository,
                                  List<IMetadataExtractor> extractors,
                                  IFileResourceProtector fileResourceProtector) {
        this.fileRepository = fileRepository;
        this.metadataExtractors = extractors.stream()
                                            .collect(toMap(IMetadataExtractor::getType, Function.identity()));
        this.fileResourceProtector = fileResourceProtector;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{id}/metadata")
    public ResponseEntity<FileMetadata<?>> getFileMetadata(@PathVariable UUID id) {
        log.info("Запрос метаданных файла: {}", id);

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));

        if (!fileResourceProtector.isAllowed(file)) {
            throw new NotFoundException(id);
        }

        try {
            FileMetadata<?> fileMetadata = metadataExtractors
                    .getOrDefault(file.getExtension(), metadataExtractors.get(DEFAULT_TYPE))
                    .extract(file);

            return ResponseEntity.ok(fileMetadata);
        } catch (MetadataExtractionException e) {
            String msg = "Не удалось получить метаданные файла: " + id;
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new DataServiceException(msg);
        }
    }
}
