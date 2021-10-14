package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.RecordsService;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@RestController
public class DocumentLibraryRecordDownloadController {

    private final Logger log = LoggerFactory.getLogger(DocumentLibraryRecordDownloadController.class);

    private final RecordsService recordsService;
    private final FileStorageService fileStorageService;
    private final DocumentLibraryService libraryService;
    private final SystemAttributeHandler systemAttributeHandler;

    public DocumentLibraryRecordDownloadController(RecordsService recordsService,
                                                   FileStorageService fileStorageService,
                                                   SystemAttributeHandler systemAttributeHandler,
                                                   DocumentLibraryService libraryService) {
        this.libraryService = libraryService;
        this.recordsService = recordsService;
        this.fileStorageService = fileStorageService;
        this.systemAttributeHandler = systemAttributeHandler;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/{field}/download")
    public ResponseEntity<Resource> downloadBinary(@PathVariable String docLibId,
                                                   @PathVariable String field,
                                                   @PathVariable Long recId,
                                                   HttpServletRequest request) {
        ResourceQualifier rIdentifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId);
        final Map<String, Object> record = recordsService.getById(rIdentifier, recId);
        final String innerFileName = (String) record.get(field);

        try {
            Resource resource = fileStorageService.loadAsResource(innerFileName);

            final SchemaDto schema = libraryService.getSchema(docLibId);
            final SystemAttributeHandler attributeHandler = this.systemAttributeHandler.initSchema(schema);
            final String contentLength = attributeHandler.getFileSize(record);

            ContentDisposition contentDisposition = ContentDisposition
                    .builder("attachment")
                    .filename(attributeHandler.getFileName(record), UTF_8)
                    .build();

            return ResponseEntity.ok()
                                 .contentType(MediaType.parseMediaType(defineFileContentType(request, resource)))
                                 .header(CONTENT_DISPOSITION, contentDisposition.toString())
                                 .header(CONTENT_LENGTH, contentLength)
                                 .body(resource);
        } catch (NoSuchFileStorageException e) {
            final String msg = String.format("Ресурс не найден. Для записи: '%s', по атрибуту: '%s'",
                                             recId, field);

            throw new NotFoundException(msg, e.getCause());
        } catch (MalformedURLStorageException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }

    @NotNull
    private String defineFileContentType(HttpServletRequest request, Resource resource) {
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.warn("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return contentType;
    }
}
