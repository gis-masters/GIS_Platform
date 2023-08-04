package ru.mycrg.data_service.controller.doc_library;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.RecordDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeleteLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.MoveRecordToNewParentRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.EcqlRecordIdHandler;
import ru.mycrg.data_service.validators.ecql.EcqlFilter;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Boolean.TRUE;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.PagingAndSortingUtil.fetchFoldersFirst;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.VERSIONS;

@Validated
@RestController
public class DocumentLibraryRecordsController {

    private final Mediator mediator;
    private final SchemaService schemaService;
    private final OrgSettingsKeeper orgSettingsKeeper;
    private final DocumentLibraryService libraryService;
    private final RecordServiceFactory recordServiceFactory;

    public DocumentLibraryRecordsController(SchemaService schemaService,
                                            DocumentLibraryService libraryService,
                                            RecordServiceFactory recordServiceFactory,
                                            Mediator mediator,
                                            OrgSettingsKeeper orgSettingsKeeper) {
        this.mediator = mediator;
        this.schemaService = schemaService;
        this.libraryService = libraryService;
        this.recordServiceFactory = recordServiceFactory;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Object> getAll(@PathVariable String docLibId,
                                         @RequestParam(required = false) Long parent,
                                         @RequestParam(name = "filter", required = false) @EcqlFilter String ecqlFilter,
                                         Pageable pageable,
                                         PagedResourcesAssembler<RecordDto> pageAssembler) {
        ResourceQualifier lQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, LIBRARY);

        checkSortedFields(docLibId, pageable);
        Pageable newPageable = fetchFoldersFirst(pageable);

        Page<RecordDto> page = recordServiceFactory.get()
                                                   .getPaged(lQualifier, newPageable, parent, ecqlFilter)
                                                   .map(record -> new RecordDto(removeVersionsFromRecord(record)));

        return ResponseEntity.ok(asPagedResources(docLibId, pageAssembler, page));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/as_registry")
    public ResponseEntity<Object> getAll(
            @PathVariable String docLibId,
            @RequestParam(name = "filter", required = false) @EcqlFilter String filter,
            @RequestParam(name = "recordId", required = false) List<Long> recordId,
            Pageable pageable,
            PagedResourcesAssembler<RecordDto> pageAssembler) {
        ResourceQualifier lQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, LIBRARY);

        checkSortedFields(docLibId, pageable);
        Pageable newPageable = fetchFoldersFirst(pageable);

        String ecqlFilter = EcqlRecordIdHandler.joinAsIn(filter, recordId);

        Page<RecordDto> page = recordServiceFactory.get()
                                                   .getAsRegistry(lQualifier, newPageable, ecqlFilter)
                                                   .map(record -> new RecordDto(removeVersionsFromRecord(record)));

        return ResponseEntity.ok(asPagedResources(docLibId, pageAssembler, page));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String docLibId,
                                                       @PathVariable Long recId) {
        ResourceQualifier qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, LIBRARY_RECORD);

        IRecord record = recordServiceFactory.get().getById(qualifier, recId);

        return ResponseEntity.ok(removeVersionsFromRecord(record).getContent());
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/versions")
    public List<DocumentVersioningDto> getVersionsByRecordId(@PathVariable String docLibId,
                                                             @PathVariable Long recId) {
        LibraryModel libraryInfo = (LibraryModel) libraryService.getInfo(docLibId);
        if (TRUE.equals(libraryInfo.getVersioned())) {
            ResourceQualifier qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, LIBRARY_RECORD);

            return recordServiceFactory.get().getVersionsByRecordId(qualifier, recId);
        } else {
            throw new BadRequestException("Библиотека не является версионируемой: " + docLibId);
        }
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Map<String, Object>> createObject(@PathVariable String docLibId,
                                                            @RequestParam(value = "body") String jsonBody) {
        orgSettingsKeeper.throwIfCreateLibraryItemNotAllowed();

        Map<String, Object> body = deserializeBody(jsonBody);
        SchemaDto schema = libraryService.getSchema(docLibId);
        Map<String, Object> props = schemaService.excludeUnknownProperties(schema, body);

        IRecord record = mediator.execute(
                new CreateLibraryRecordRequest(schema,
                                               new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, LIBRARY),
                                               new RecordEntity(props)));

        return new ResponseEntity<>(record.getContent(), CREATED);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PatchMapping(path = "/document-libraries/{docLibId}/records/{recId}", consumes = APPLICATION_JSON_MERGE_PATCH)
    public ResponseEntity<Object> updateRecord(@PathVariable String docLibId,
                                               @PathVariable Long recId,
                                               @RequestBody Map<String, Object> payload) {
        if (!payload.isEmpty()) {
            SchemaDto schema = libraryService.getSchema(docLibId);
            schemaService.throwIfNotMatchSchema(schema, payload);

            ResourceQualifier rQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, LIBRARY_RECORD);
            mediator.execute(
                    new UpdateLibraryRecordRequest(schema,
                                                   rQualifier,
                                                   new RecordEntity(payload)));
        }

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable Long recId) {
        ResourceQualifier qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, LIBRARY_RECORD);

        SchemaDto schema = libraryService.getSchema(docLibId);
        IRecord record = recordServiceFactory.get().getById(qualifier, recId);

        mediator.execute(
                new DeleteLibraryRecordRequest(qualifier, record, schema));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/move/{parentId}")
    public ResponseEntity<Object> moveRecord(@PathVariable String docLibId,
                                             @PathVariable Long recId,
                                             @PathVariable Long parentId) {
        ResourceQualifier qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, LIBRARY_RECORD);

        mediator.execute(new MoveRecordToNewParentRequest(qualifier, parentId));

        return ResponseEntity.ok().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/move")
    public ResponseEntity<Object> moveRecord(@PathVariable String docLibId,
                                             @PathVariable Long recId) {
        return moveRecord(docLibId, recId, null);
    }

    private void checkSortedFields(String docLibId, Pageable pageable) {
        Map<String, Object> body = new HashMap<>();
        pageable.getSort().forEach(order -> body.put(order.getProperty(), ""));

        String schemaId = libraryService.getInfo(docLibId).getSchemaId();

        schemaService.throwIfNotMatchSchema(schemaId, body);
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

    @NotNull
    private PagedResources<Resource<RecordDto>> asPagedResources(String docLibId,
                                                                 PagedResourcesAssembler<RecordDto> pageAssembler,
                                                                 Page<RecordDto> result) {
        return pageAssembler.toResource(result,
                                        linkTo(DocumentLibraryRecordsController.class)
                                                .slash("/api/data/document-libraries/" + docLibId + "/records")
                                                .withSelfRel());
    }

    @NotNull
    private static IRecord removeVersionsFromRecord(IRecord record) {
        Map<String, Object> content = record.getContent();
        content.remove(VERSIONS.getName(), content.get(VERSIONS.getName()));

        return record;
    }
}
