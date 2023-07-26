package ru.mycrg.data_service.controller.integrations;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.gisogd.GisogdRfPublisher;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@RestController
@RequestMapping("/gisogd-rf")
public class GisogdRfController {

    private final GisogdRfPublisher gisogdRfPublisher;

    public GisogdRfController(GisogdRfPublisher gisogdRfPublisher) {
        this.gisogdRfPublisher = gisogdRfPublisher;
    }

    @PostMapping("/send")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> send(@RequestParam String libraryId,
                                       @RequestParam Long recordId) {
        ResourceQualifier qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryId, recordId, LIBRARY);

        Long taskId = gisogdRfPublisher.publish(qualifier);

        return ResponseEntity.status(CREATED).body(taskId);
    }
}
