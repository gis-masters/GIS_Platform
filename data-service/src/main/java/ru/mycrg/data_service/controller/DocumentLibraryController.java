package ru.mycrg.data_service.controller;

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
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.FileStorageService;
import ru.mycrg.data_service.service.RecordsService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.JsonConverter.mapper;

@RestController
public class DocumentLibraryController {

    public static final Logger log = LoggerFactory.getLogger(DocumentLibraryController.class);

    private final SchemaService schemaService;
    private final RecordsService recordsService;
    private final FileStorageService fileStorageService;

    public DocumentLibraryController(RecordsService recordsService,
                                     SchemaService schemaService,
                                     FileStorageService fileStorageService) {
        this.schemaService = schemaService;
        this.recordsService = recordsService;
        this.fileStorageService = fileStorageService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}")
    public Object createObject(@PathVariable String docLibId,
                               @RequestParam(value = "files", required = false) MultipartFile[] files,
                               @RequestParam(value = "body", required = false) String jsonBody,
                               Authentication authentication) {
        try {
            List<ITableObject> objects = new ArrayList<>();

            Map<String, Object> body = deserializeBody(jsonBody);

            ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE,
                                                                    new ResourceIdentifier("data", SCHEMA));

            if (files.length > 0) {
                for (MultipartFile file: files) {
                    if (file.isEmpty()) {
                        throw new BadRequestException("File is empty");
                    }

                    ITableObject tableObject = recordsService.createRecord(rIdentifier, body, authentication);

                    fileStorageService.storeFile(file, tableObject.getId().toString());

                    objects.add(tableObject);
                }
            } else {
                ITableObject tableObject = recordsService.createRecord(rIdentifier, body, authentication);

                objects.add(tableObject);
            }

            return objects;
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/schema")
    public Object getLibSchema(@PathVariable String docLibId) {
        return schemaService
                .getSchemaByName(docLibId)
                .orElseThrow(() -> new NotFoundException("Not found schema for library: " + docLibId));
    }

    @GetMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Object> getAll(@PathVariable String docLibId,
                                         Pageable pageable,
                                         Authentication authentication,
                                         PagedResourcesAssembler<Map<String, Object>> pageAssembler) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE,
                                                                new ResourceIdentifier("data", SCHEMA));

        Page<Map<String, Object>> result = recordsService.getPaged(rIdentifier, pageable, authentication);

        var pagedResources = pageAssembler.toResource(
                result,
                linkTo(DocumentLibraryController.class)
                        .slash("/api/data/document-libraries/" + docLibId + "/records")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String docLibId,
                                                       @PathVariable UUID recId,
                                                       Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE,
                                                                new ResourceIdentifier("data", SCHEMA));

        Map<String, Object> entity = recordsService.getById(rIdentifier, recId, authentication);

        return ResponseEntity.ok(entity);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable UUID recId,
                                         Authentication authentication) {
        fileStorageService.removeFile(recId.toString());

        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, TABLE,
                                                                new ResourceIdentifier("data", SCHEMA));

        recordsService.deleteRecord(rIdentifier, recId, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/download")
    public ResponseEntity<Resource> downloadBinary(@PathVariable String docLibId,
                                                   @PathVariable UUID recId,
                                                   HttpServletRequest request,
                                                   Authentication authentication) {
        Resource resource = fileStorageService.loadFileAsResource(recId.toString());

        // Try to determine file's content type
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

        return ResponseEntity.ok()
                             .contentType(MediaType.parseMediaType(contentType))
                             .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"",
                                                                                    resource.getFilename()))
                             .body(resource);
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
