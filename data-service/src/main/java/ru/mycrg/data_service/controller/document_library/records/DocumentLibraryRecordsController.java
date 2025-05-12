package ru.mycrg.data_service.controller.document_library.records;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordDto;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeleteLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.RecoverLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.EcqlRecordIdHandler;
import ru.mycrg.data_service.validators.ecql.EcqlFilter;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Boolean.TRUE;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryRecordQualifier;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.excludeUnknownProperties;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.throwIfNotMatchSchema;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.IS_FOLDER;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.VERSIONS;
import static ru.mycrg.http_client.JsonConverter.fromJson;

@Validated
@RestController
public class DocumentLibraryRecordsController {

    private final Mediator mediator;
    private final OrgSettingsKeeper orgSettingsKeeper;
    private final DocumentLibraryService libraryService;
    private final RecordServiceFactory recordServiceFactory;

    public DocumentLibraryRecordsController(DocumentLibraryService libraryService,
                                            RecordServiceFactory recordServiceFactory,
                                            Mediator mediator,
                                            OrgSettingsKeeper orgSettingsKeeper) {
        this.mediator = mediator;
        this.libraryService = libraryService;
        this.recordServiceFactory = recordServiceFactory;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Object> getAll(@PathVariable String docLibId,
                                         @RequestParam(required = false) Long parent,
                                         @RequestParam(name = "filter", required = false) @EcqlFilter String ecqlFilter,
                                         Pageable pageable) {
        checkSortedFields(docLibId, pageable);

        Page<RecordDto> page = recordServiceFactory.get()
                                                   .getPaged(libraryQualifier(docLibId),
                                                             fetchFoldersFirst(pageable),
                                                             parent,
                                                             ecqlFilter)
                                                   .map(record -> new RecordDto(removeVersionsFromRecord(record)));

        return ResponseEntity.ok(pageFromList(page, pageable));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/as_registry")
    public ResponseEntity<Object> getAll(
            @PathVariable String docLibId,
            @RequestParam(name = "filter", required = false) @EcqlFilter String filter,
            @RequestParam(name = "recordId", required = false) List<Long> recordId,
            Pageable pageable) {
        checkSortedFields(docLibId, pageable);

        String ecqlFilter = EcqlRecordIdHandler.joinAsIn(filter, recordId);

        Page<RecordDto> page = recordServiceFactory.get()
                                                   .getAsRegistry(libraryQualifier(docLibId), pageable, ecqlFilter)
                                                   .map(record -> new RecordDto(removeVersionsFromRecord(record)));

        return ResponseEntity.ok(pageFromList(page, pageable));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String docLibId,
                                                       @PathVariable Long recId) {
        IRecord record = recordServiceFactory.get()
                                             .getById(libraryRecordQualifier(docLibId, recId),
                                                      recId);

        return ResponseEntity.ok(removeVersionsFromRecord(record).getContent());
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/versions")
    public List<DocumentVersioningDto> getVersionsByRecordId(@PathVariable String docLibId,
                                                             @PathVariable Long recId) {
        LibraryModel libraryInfo = (LibraryModel) libraryService.getInfo(docLibId);
        if (TRUE.equals(libraryInfo.getVersioned())) {
            return recordServiceFactory.get()
                                       .getVersionsByRecordId(libraryRecordQualifier(docLibId, recId),
                                                              recId);
        } else {
            throw new BadRequestException("Библиотека не является версионируемой: " + docLibId);
        }
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records")
    public ResponseEntity<Map<String, Object>> createObject(@PathVariable String docLibId,
                                                            @RequestParam(value = "body") String jsonBody) {
        orgSettingsKeeper.throwIfCreateLibraryItemNotAllowed();

        Map<String, Object> data = fromJson(jsonBody, Map.class)
                .orElseThrow(() -> new BadRequestException("Передан не корректный body: " + jsonBody));
        SchemaDto schema = libraryService.getSchema(docLibId);
        Map<String, Object> props = excludeUnknownProperties(schema, data);

        ResponseWithReport response = mediator.execute(
                new CreateLibraryRecordRequest(schema,
                                               libraryQualifier(docLibId),
                                               new RecordEntity(props)));

        return new ResponseEntity<>(response.getContent(), CREATED);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PatchMapping(path = "/document-libraries/{docLibId}/records/{recId}", consumes = APPLICATION_JSON_MERGE_PATCH)
    public ResponseEntity<ResponseWithReport> updateRecord(@PathVariable String docLibId,
                                                           @PathVariable Long recId,
                                                           @RequestBody Map<String, Object> payload) {
        ResponseWithReport response = new ResponseWithReport();
        if (!payload.isEmpty()) {
            SchemaDto schema = libraryService.getSchema(docLibId);
            throwIfNotMatchSchema(schema, payload);

            response = mediator.execute(
                    new UpdateLibraryRecordRequest(schema,
                                                   libraryRecordQualifier(docLibId, recId),
                                                   new RecordEntity(payload)));
        }

        return ResponseEntity.ok(response);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable Long recId) {
        ResourceQualifier qualifier = libraryRecordQualifier(docLibId, recId);

        SchemaDto schema = libraryService.getSchema(docLibId);
        IRecord record = recordServiceFactory.get().getById(qualifier, recId);

        mediator.execute(
                new DeleteLibraryRecordRequest(qualifier, record, schema));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping(path = "/document-libraries/{docLibId}/records/{recId}/recover")
    public ResponseEntity<Object> recoverRecord(@PathVariable String docLibId,
                                                @PathVariable Long recId,
                                                @RequestParam(required = false) Long recoverFolderId) {
        mediator.execute(
                new RecoverLibraryRecordRequest(libraryRecordQualifier(docLibId, recId), recoverFolderId));

        return ResponseEntity.noContent().build();
    }

    private void checkSortedFields(String docLibId, Pageable pageable) {
        Map<String, Object> body = new HashMap<>();
        pageable.getSort().forEach(order -> body.put(order.getProperty(), ""));

        SchemaDto schema = libraryService.getInfo(docLibId).getSchema();
        if (schema == null) {
            throw new NotFoundException("Не найдена схема библиотеки: " + docLibId);
        }

        throwIfNotMatchSchema(schema, body);
    }

    @NotNull
    private static IRecord removeVersionsFromRecord(IRecord record) {
        Map<String, Object> content = record.getContent();
        content.remove(VERSIONS.getName(), content.get(VERSIONS.getName()));

        return record;
    }

    /**
     * Add order DESC for content type field. This sets folders first.
     *
     * @param pageable Pagination information.
     */
    @NotNull
    private static Pageable fetchFoldersFirst(Pageable pageable) {
        try {
            List<Sort.Order> orders = new ArrayList<>();
            orders.add(Sort.Order.desc(IS_FOLDER.name()));

            pageable.getSort().forEach(orders::add);

            final Sort modifiedSort = Sort.by(orders);

            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), modifiedSort);
        } catch (Exception e) {
            return pageable;
        }
    }
}
