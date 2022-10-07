package ru.mycrg.data_service.controller.integrations;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.GisogdRfIntegrator;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@RestController
@RequestMapping("/gisogd_rf")
public class GisogdRfController {

    private final GisogdRfIntegrator gisogdRfIntegrator;

    public GisogdRfController(GisogdRfIntegrator gisogdRfIntegrator) {
        this.gisogdRfIntegrator = gisogdRfIntegrator;
    }

    @PostMapping("/send")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> send(@RequestParam String libraryId,
                                       @RequestParam(required = false, defaultValue = "") String contentTypeId) {
        ResourceQualifier lQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryId, LIBRARY);

        final String tokenGisogdRF = gisogdRfIntegrator.getTokenGisogdRF();

        gisogdRfIntegrator.send(tokenGisogdRF, lQualifier, contentTypeId);

        return ResponseEntity.status(OK).build();
    }
}
