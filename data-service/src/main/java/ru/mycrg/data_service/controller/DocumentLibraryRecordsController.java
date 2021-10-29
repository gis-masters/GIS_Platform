package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.RecordDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.RecordsService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;
import static ru.mycrg.data_service.dao.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service.util.PagingAndSortingUtil.fetchFoldersFirst;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.INNER_PATH;

@RestController
public class DocumentLibraryRecordsController {

    private final SchemaService schemaService;
    private final RecordsService recordsService;
    private final FileStorageService fileStorageService;
    private final DocumentLibraryService libraryService;

    public DocumentLibraryRecordsController(SchemaService schemaService,
                                            RecordsService recordsService,
                                            FileStorageService fileStorageService,
                                            DocumentLibraryService libraryService) {
        this.schemaService = schemaService;
        this.libraryService = libraryService;
        this.recordsService = recordsService;
        this.fileStorageService = fileStorageService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Object> getAll(@PathVariable String docLibId,
                                         @RequestParam(required = false) Long parent,
                                         @RequestParam(required = false, defaultValue = "") String title,
                                         Pageable pageable,
                                         PagedResourcesAssembler<RecordDto> pageAssembler) {
        ResourceQualifier lQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId);

        checkSortedFields(docLibId, pageable);

        var result = recordsService.getPaged(lQualifier, fetchFoldersFirst(pageable), parent, title);

        var pagedResources = pageAssembler.toResource(
                result,
                linkTo(DocumentLibraryRecordsController.class)
                        .slash("/api/data/document-libraries/" + docLibId + "/records")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String docLibId,
                                                       @PathVariable Long recId) {
        ResourceQualifier rIdentifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId);

        Map<String, Object> entity = recordsService.getById(rIdentifier, recId);

        return ResponseEntity.ok(entity);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Map<String, Object>> createObject(
            @PathVariable String docLibId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "body") String jsonBody) {
        ResourceQualifier libraryQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId);

        Map<String, Object> body = deserializeBody(jsonBody);
        String schemaId = libraryService.getByTableName(docLibId).getSchemaId();
        schemaService.throwIfNotMathSchema(schemaId, body);

        IRecord record = recordsService.createRecord(libraryQualifier, new RecordEntity(body), file);

        return new ResponseEntity<>(record.getContent(), CREATED);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PatchMapping(path = "/document-libraries/{docLibId}/records/{recId}", consumes = APPLICATION_JSON_MERGE_PATCH)
    public ResponseEntity<Object> updateRecord(@PathVariable String docLibId,
                                               @PathVariable Long recId,
                                               @RequestBody Map<String, Object> payload) {
        String schemaId = libraryService.getByTableName(docLibId).getSchemaId();
        schemaService.throwIfNotMathSchema(schemaId, payload);

        recordsService.update(new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, LIBRARY), payload);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable Long recId) {
        ResourceQualifier rIdentifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId);
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

    private void checkSortedFields(String docLibId, Pageable pageable) {
        final HashMap<String, Object> body = new HashMap<>();
        pageable.getSort().forEach(order -> body.put(order.getProperty(), ""));

        String schemaId = libraryService.getByTableName(docLibId).getSchemaId();
        schemaService.throwIfNotMathSchema(schemaId, body);
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
