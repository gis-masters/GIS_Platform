package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.service.OrganizationService;
import ru.mycrg.gis.service.Processable;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.export.ExportService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.validation.ValidationService;

/**
 * Данный диспетчер находит нужный обработчик события, имплементирующий {@link ru.mycrg.gis.service.Processable}
 */
@Service
public class EventDispatcher {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final OrganizationService organizationService;
    private final ValidationService validationService;
    private final ImportService importService;
    private final ExportService exportService;
    private final ProjectService projectService;

    public EventDispatcher(OrganizationService organizationService,
                           ValidationService validationService,
                           ImportService importService,
                           ExportService exportService,
                           ProjectService projectService) {
        this.organizationService = organizationService;
        this.validationService = validationService;
        this.importService = importService;
        this.exportService = exportService;
        this.projectService = projectService;
    }

    public void handleEvent(BaseMqProcessResponse mqResponse) {
        try {
            getHandler(mqResponse.getType())
                    .handleMqResponse(mqResponse);
        } catch (Exception e) {
            log.error("Not processable event type");
        }
    }

    private Processable getHandler(ProcessType type) throws Exception {
        switch (type) {
            case CREATE_ORG:        return organizationService;
            case CREATE_PROJECT:
            case DELETE_PROJECT:    return projectService;
            case IMPORT:            return importService;
            case EXPORT:            return exportService;
            case VALIDATION:        return validationService;
            default:
                throw new Exception("Not processable event type");
        }
    }
}
