package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.gis.service.OrganizationService;
import ru.mycrg.gis.service.Processable;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.export.ExportService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.validation.ValidationService;

import static ru.mycrg.common.config.MqProperties.QUEUE_ORG_CREATED;

@Component
@EnableRabbit
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final Processable projectService;
    private final Processable importService;
    private final Processable validationService;
    private final Processable exportService;
    private final OrganizationService organizationService;

    @Autowired
    public MqListener(OrganizationService organizationService,
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

    @RabbitListener(queues = QUEUE_ORG_CREATED)
    public void created(BaseMqProcessResponse response) {
        try {
            switch (response.getType()) {
//                case CREATE_ORG:        organizationService.handleMqResponse(response);
//                    break;
                case CREATE_PROJECT:
                case DELETE_PROJECT:    projectService.handleMqResponse(response);
                    break;
                default:
                    log.warn("Not processable event type");
            }
        } catch (Exception e) {
            log.error("Error handle mqResponse: {}", response.toString());
        }
    }

//    @RabbitListener(queues = QUEUE_VALIDATION_RESULT)
//    public void validationResult(ValidationMqResponse response) {
//        validationService.handleMqResponse(response);
//    }
//
//    @RabbitListener(queues = QUEUE_IMPORT_RESPONSE)
//    public void importResponse(ImportMqResponse response) {
//        importService.handleMqResponse(response);
//    }
//
//    @RabbitListener(queues = QUEUE_GML_RESPONSE)
//    public void gmlResponse(MqExportResponse response) {
//        exportService.handleMqResponse(response);
//    }
}
