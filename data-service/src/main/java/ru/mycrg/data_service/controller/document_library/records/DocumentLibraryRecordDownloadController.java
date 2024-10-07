package ru.mycrg.data_service.controller.document_library.records;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.controller.BaseController;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.SystemAttributeHandler;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import javax.servlet.http.HttpServletRequest;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@RestController
public class DocumentLibraryRecordDownloadController extends BaseController {

    private final FileStorageService fileStorageService;
    private final DocumentLibraryService libraryService;
    private final RecordServiceFactory recordServiceFactory;
    private final SystemAttributeHandler systemAttributeHandler;

    public DocumentLibraryRecordDownloadController(FileStorageService fileStorageService,
                                                   SystemAttributeHandler systemAttributeHandler,
                                                   DocumentLibraryService libraryService,
                                                   RecordServiceFactory recordServiceFactory) {
        this.libraryService = libraryService;
        this.fileStorageService = fileStorageService;
        this.systemAttributeHandler = systemAttributeHandler;
        this.recordServiceFactory = recordServiceFactory;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/{field}/download")
    public ResponseEntity<Resource> downloadBinary(@PathVariable String docLibId,
                                                   @PathVariable String field,
                                                   @PathVariable Long recId,
                                                   HttpServletRequest request) {
        IRecord record = recordServiceFactory.get().getById(libraryQualifier(docLibId), recId);
        String path = (String) record.getContent().get(field);

        try {
            Resource resource = fileStorageService.loadFromMainStorage(path);

            SchemaDto schema = libraryService.getSchema(docLibId);
            SystemAttributeHandler attributeHandler = this.systemAttributeHandler.init(schema, record.getContent());
            String contentLength = attributeHandler.getFileSize(record);

            ContentDisposition contentDisposition = ContentDisposition
                    .builder("attachment")
                    .filename(attributeHandler.prepareFileName(record), UTF_8)
                    .build();

            return ResponseEntity.ok()
                                 .contentType(MediaType.parseMediaType(defineFileContentType(request, resource)))
                                 .header(CONTENT_DISPOSITION, contentDisposition.toString())
                                 .header(CONTENT_LENGTH, contentLength)
                                 .body(resource);
        } catch (NoSuchFileStorageException e) {
            String msg = String.format("Ресурс не найден. Для записи: '%s', по атрибуту: '%s'",
                                       recId, field);

            throw new NotFoundException(msg, e.getCause());
        } catch (MalformedURLStorageException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }
}
