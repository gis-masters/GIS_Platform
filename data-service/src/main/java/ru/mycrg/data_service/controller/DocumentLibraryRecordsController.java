package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.*;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.mq_queue_contract.SchemaDto;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.CrgDataSourcesPool.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PARENT;
import static ru.mycrg.data_service.util.filter.FilterCondition.*;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.INNER_PATH;

@RestController
public class DocumentLibraryRecordsController {

    public static final Logger log = LoggerFactory.getLogger(DocumentLibraryRecordsController.class);

    private final DocumentLibraryService libraryService;
    private final RecordsService recordsService;
    private final FileStorageService fileStorageService;
    private final SystemAttributeHandler systemAttributeHandler;

    public DocumentLibraryRecordsController(RecordsService recordsService,
                                            DocumentLibraryService libraryService,
                                            SystemAttributeHandler systemAttributeHandler,
                                            FileStorageService fileStorageService) {
        this.libraryService = libraryService;
        this.recordsService = recordsService;
        this.fileStorageService = fileStorageService;
        this.systemAttributeHandler = systemAttributeHandler;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records")
    public Object createObject(@PathVariable String docLibId,
                               @RequestParam(value = "file", required = false) MultipartFile file,
                               @RequestParam(value = "body") String jsonBody,
                               Authentication authentication) {
        try {
            List<ITableObject> objects = new ArrayList<>();
            String innerFileName = UUID.randomUUID().toString();

            ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);

            Map<String, Object> body = deserializeBody(jsonBody);
            libraryService.checkObjectBySchema(body, docLibId);
            systemAttributeHandler.fetchSchema(docLibId)
                                  .fillCreator(body, authentication)
                                  .fillTimes(body)
                                  .fillFileInfo(body, file)
                                  .fillFileInnerName(body, innerFileName);

            if (file != null) {
                if (file.isEmpty()) {
                    throw new BadRequestException("File is empty");
                }

                ITableObject tableObject = recordsService.createRecord(rIdentifier, body, authentication);

                fileStorageService.storeFile(file, innerFileName);

                objects.add(tableObject);
            } else {
                ITableObject tableObject = recordsService.createRecord(rIdentifier, body, authentication);

                objects.add(tableObject);
            }

            return objects;
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }

    @GetMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Object> getAll(@PathVariable String docLibId,
                                         @RequestParam(required = false, defaultValue = "") String parent,
                                         @RequestParam(required = false, defaultValue = "") String title,
                                         Pageable pageable,
                                         Authentication authentication,
                                         PagedResourcesAssembler<Map<String, Object>> pageAssembler) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);

        checkSortedFields(docLibId, pageable);

        final CrgFilter filter = prepareFilter(parent, title);
        final SchemaDto schema = libraryService.getSchema(docLibId);
        Page<Map<String, Object>> result = recordsService.getPaged(rIdentifier, schema, pageable, filter);

        var pagedResources = pageAssembler.toResource(
                result,
                linkTo(DocumentLibraryRecordsController.class)
                        .slash("/api/data/document-libraries/" + docLibId + "/records")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
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

    @GetMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String docLibId,
                                                       @PathVariable UUID recId,
                                                       Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);

        Map<String, Object> entity = recordsService.getById(rIdentifier, recId, authentication);

        return ResponseEntity.ok(entity);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable UUID recId,
                                         Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);
        final Map<String, Object> record = recordsService.getById(rIdentifier, recId, authentication);
        final String innerFileName = (String) record.get(INNER_PATH.getName());

        fileStorageService.removeFile(innerFileName);
        recordsService.deleteRecord(rIdentifier, recId, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/{field}/download")
    public ResponseEntity<Resource> downloadBinary(@PathVariable String docLibId,
                                                   @PathVariable String field,
                                                   @PathVariable UUID recId,
                                                   HttpServletRequest request,
                                                   Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE, SYSTEM_SCHEMA_NAME, SCHEMA);
        final Map<String, Object> record = recordsService.getById(rIdentifier, recId, authentication);
        final String innerFileName = (String) record.get(field);

        Resource resource = fileStorageService.loadFileAsResource(innerFileName);

        return ResponseEntity.ok()
                             .contentType(MediaType.parseMediaType(defineFileContentType(request, resource)))
                             .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"",
                                                                                    resource.getFilename()))
                             .body(resource);
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
