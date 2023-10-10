package ru.mycrg.data_service.controller.integrations;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.service.gisogd.GisogdRfPublisher;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.*;
import static ru.mycrg.data_service.service.TaskService.TASK_QUALIFIER;
import static ru.mycrg.data_service.service.gisogd.GisogdRfPublisher.INBOX_MARKER;

@RestController
@RequestMapping("/gisogd-rf")
public class GisogdRfController {

    private final BaseDao baseDao;
    private final TableService tableService;
    private final GisogdRfPublisher gisogdRfPublisher;

    public GisogdRfController(BaseDao baseDao,
                              TableService tableService,
                              GisogdRfPublisher gisogdRfPublisher) {
        this.baseDao = baseDao;
        this.tableService = tableService;
        this.gisogdRfPublisher = gisogdRfPublisher;
    }

    @PostMapping("/send")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> send(@RequestParam String entityName,
                                       @RequestParam Long entityId,
                                       @RequestParam(defaultValue = "4326", required = false) Integer srid) {
        long taskId = -314L;
        gisogdRfPublisher.publish(taskId, makeQualifier(entityName, entityId), srid);

        return ResponseEntity.status(CREATED).body(taskId);
    }

    @PostMapping("/publish")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> publish(@RequestParam(defaultValue = "100") Long limit,
                                          @RequestParam(defaultValue = "4326", required = false) Integer srid) {
        Long taskId = gisogdRfPublisher.fullPublication(limit, srid);

        return ResponseEntity.status(CREATED).body(taskId);
    }

    @PostMapping("/audit")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> audit(@RequestParam String entityName,
                                        @RequestParam Long entityId) {
        ResourceQualifier qualifier = makeQualifier(entityName, entityId);

        gisogdRfPublisher.audit(qualifier);

        return ResponseEntity.status(CREATED).body(qualifier);
    }

    private ResourceQualifier makeQualifier(String entityName, Long entityId) {
        if (entityName.equalsIgnoreCase(INBOX_MARKER)) {
            return new ResourceQualifier(TASK_QUALIFIER, entityId, TASK);
        } else if (itIsLibrary(entityName)) {
            return new ResourceQualifier(SYSTEM_SCHEMA_NAME, entityName, entityId, LIBRARY);
        } else {
            String dataset = tableService.getDatasetByTableName(entityName);

            return new ResourceQualifier(dataset, entityName, entityId, TABLE);
        }
    }

    private boolean itIsLibrary(String entityName) {
        ResourceQualifier docLibraries = new ResourceQualifier(SYSTEM_SCHEMA_NAME, "doc_libraries");
        String filterByTableName = "table_name = '" + entityName + "'";

        return baseDao.findBy(docLibraries, filterByTableName)
                      .isPresent();
    }
}
