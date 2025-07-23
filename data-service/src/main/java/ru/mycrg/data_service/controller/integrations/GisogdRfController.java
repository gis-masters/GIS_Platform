package ru.mycrg.data_service.controller.integrations;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.service.gisogd.GisogdRfAuditor;
import ru.mycrg.data_service.service.gisogd.GisogdRfService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;

import static org.springframework.http.HttpStatus.ACCEPTED;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_SRID_DEGREE;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.document_library.DocumentLibraryService.DL_QUALIFIER;

@RestController
@RequestMapping("/gisogd-rf")
public class GisogdRfController {

    private final BaseReadDao baseReadDao;
    private final TableService tableService;
    private final GisogdRfAuditor gisogdRfAuditor;
    private final GisogdRfService gisogdRfService;

    public GisogdRfController(BaseReadDao baseReadDao,
                              TableService tableService,
                              GisogdRfAuditor gisogdRfAuditor,
                              GisogdRfService gisogdRfService) {
        this.baseReadDao = baseReadDao;
        this.tableService = tableService;
        this.gisogdRfAuditor = gisogdRfAuditor;
        this.gisogdRfService = gisogdRfService;
    }

    @PostMapping("/send")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> publishSingle(
            @RequestParam String entityName,
            @RequestParam Long entityId,
            @RequestParam(defaultValue = DEFAULT_SRID_DEGREE, required = false) Integer srid) {
        Long taskId = gisogdRfService.publish(makeQualifier(entityName, entityId), srid);

        return ResponseEntity.status(CREATED).body(taskId);
    }

    @PostMapping("/send-library")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> publishOneLibrary(
            @RequestParam String libraryName,
            @RequestParam(defaultValue = "100") Long limit,
            @RequestParam(defaultValue = DEFAULT_SRID_DEGREE, required = false) Integer srid) {
        Long taskId = gisogdRfService.libraryPublication(libraryName, limit, srid);

        return ResponseEntity.status(CREATED).body(taskId);
    }

    @PostMapping("/publish")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> publishAll(
            @RequestParam(defaultValue = "100") Long limit,
            @RequestParam(defaultValue = DEFAULT_SRID_DEGREE, required = false) Integer srid) {
        Long taskId = gisogdRfService.fullPublication(limit, srid);

        return ResponseEntity.status(CREATED).body(taskId);
    }

    @PostMapping("/audit")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> audit(@RequestParam String entityName,
                                        @RequestParam Long entityId) {
        ResourceQualifier qualifier = makeQualifier(entityName, entityId);

        gisogdRfAuditor.audit(qualifier);

        return ResponseEntity.status(ACCEPTED).body(qualifier);
    }

    @PostMapping("/full-audit")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> fullAudit(@RequestParam(defaultValue = "100") Long limit) {
        gisogdRfAuditor.fullAudit(limit);

        return ResponseEntity.status(ACCEPTED).body("Принято в работу. Полная публикация с лимитом: " + limit);
    }

    private ResourceQualifier makeQualifier(String tableName, Long entityId) {
        if (itIsLibrary(tableName)) {
            return new ResourceQualifier(SYSTEM_SCHEMA_NAME, tableName, entityId, LIBRARY);
        } else {
            String dataset = tableService.getDatasetByTableName(tableName);

            return new ResourceQualifier(dataset, tableName, entityId, TABLE);
        }
    }

    private boolean itIsLibrary(String entityName) {
        return baseReadDao.findBy(DL_QUALIFIER, "table_name = '" + entityName + "'")
                          .isPresent();
    }
}
