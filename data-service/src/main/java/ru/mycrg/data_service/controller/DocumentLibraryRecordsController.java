package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.RecordsService;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.CrgDataSourcesPool.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service.util.PagingAndSortingUtil.fetchFoldersFirst;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.INNER_PATH;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PARENT;
import static ru.mycrg.data_service.util.filter.FilterCondition.*;

@RestController
public class DocumentLibraryRecordsController {

    public static final Logger log = LoggerFactory.getLogger(DocumentLibraryRecordsController.class);

    private final RecordsService recordsService;
    private final FileStorageService fileStorageService;
    private final DocumentLibraryService libraryService;
    private final SystemAttributeHandler systemAttributeHandler;

    public DocumentLibraryRecordsController(RecordsService recordsService,
                                            FileStorageService fileStorageService,
                                            SystemAttributeHandler systemAttributeHandler,
                                            DocumentLibraryService libraryService) {
        this.libraryService = libraryService;
        this.recordsService = recordsService;
        this.fileStorageService = fileStorageService;
        this.systemAttributeHandler = systemAttributeHandler;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records")
    public Object createObject(@PathVariable String docLibId,
                               @RequestParam(value = "file", required = false) MultipartFile file,
                               @RequestParam(value = "body") String jsonBody) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);

        Map<String, Object> body = deserializeBody(jsonBody);
        libraryService.checkObjectBySchema(body, rIdentifier.getId());

        final ITableObject record = recordsService.createRecord(rIdentifier, body, file);

        return new ResponseEntity<>(record, CREATED);
    }

    @GetMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Object> getAll(@PathVariable String docLibId,
                                         @RequestParam(required = false, defaultValue = "") String parent,
                                         @RequestParam(required = false, defaultValue = "") String title,
                                         Pageable pageable,
                                         PagedResourcesAssembler<Map<String, Object>> pageAssembler) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);

        checkSortedFields(docLibId, pageable);

        final CrgFilter filter = prepareFilter(parent, title);
        final SchemaDto schema = libraryService.getSchema(docLibId);
        var result = recordsService.getPaged(rIdentifier, schema, fetchFoldersFirst(pageable), filter);

        var pagedResources = pageAssembler.toResource(
                result,
                linkTo(DocumentLibraryRecordsController.class)
                        .slash("/api/data/document-libraries/" + docLibId + "/records")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String docLibId,
                                                       @PathVariable UUID recId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);

        Map<String, Object> entity = recordsService.getById(rIdentifier, recId);

        return ResponseEntity.ok(entity);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable UUID recId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);
        final Map<String, Object> record = recordsService.getById(rIdentifier, recId);
        final String innerFileName = (String) record.get(INNER_PATH.getName());

        try {
            fileStorageService.deleteIfExists(innerFileName);
            recordsService.deleteRecord(rIdentifier, recId);
        } catch (StorageException e) {
            throw new DataServiceException("Не удалось удалить файл: " + innerFileName, e.getCause());
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось удалить упоминание о файле", e.getCause());
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/{field}/download")
    public ResponseEntity<Resource> downloadBinary(@PathVariable String docLibId,
                                                   @PathVariable String field,
                                                   @PathVariable UUID recId,
                                                   HttpServletRequest request) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);
        final Map<String, Object> record = recordsService.getById(rIdentifier, recId);
        final String innerFileName = (String) record.get(field);

        try {
            Resource resource = fileStorageService.loadAsResource(innerFileName);

            final SystemAttributeHandler attributeHandler = this.systemAttributeHandler.initSchema(rIdentifier.getId());
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
    private CrgFilter prepareFilter(String parent, String title) {
        final CrgFilter filter = new CrgFilter();
        if (parent.isEmpty()) {
            filter.addFilter(PARENT.getName(), parent, IS_NULL);
        } else {
            filter.addFilter(PARENT.getName(), parent, EQUAL_TO);
        }

        if (!title.isEmpty()) {
            filter.addFilter("title", title, LIKE);
        }

        return filter;
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

    private void checkSortedFields(String docLibId, Pageable pageable) {
        final HashMap<String, Object> body = new HashMap<>();
        pageable.getSort().forEach(order -> body.put(order.getProperty(), ""));

        libraryService.checkObjectBySchema(body, docLibId);
    }

    private Map<String, Object> deserializeBody(@Nullable String jsonString) {
        try {
            if (jsonString == null) {
                return new LinkedHashMap<>();
            }

            return mapper.readValue(jsonString, LinkedHashMap.class);
        } catch (IOException e) {
            throw new BadRequestException("Incorrect body: " + jsonString);
        }
    }
}
