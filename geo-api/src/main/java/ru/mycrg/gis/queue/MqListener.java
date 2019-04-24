package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.OrgMqResponse;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.gis.service.OrganizationService;
import ru.mycrg.gis.service.Processable;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.gml.GmlGenerationService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.validation.ValidationService;

import static ru.mycrg.common.config.MqProperties.*;

@Component
@EnableRabbit
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final Processable validationService;
    private final Processable importService;
    private final Processable gmlGenerationService;
    private final OrganizationService organizationService;
    private final ProjectService projectService;

    @Autowired
    public MqListener(OrganizationService organizationService,
                      ValidationService validationService,
                      ImportService importService,
                      ProjectService projectService,
                      GmlGenerationService gmlGenerationService) {
        this.organizationService = organizationService;
        this.validationService = validationService;
        this.importService = importService;
        this.gmlGenerationService = gmlGenerationService;
        this.projectService = projectService;
    }

    @RabbitListener(queues = QUEUE_ORG_CREATED)
    public void created(OrgMqResponse response) {
        switch (response.getEventType()) {
            case CREATE_ORG: organizationService.organizationCreated(response.getId()); break;
            case CREATE_PROJECT: projectService.handleResponse(response); break;
            default: log.warn("Not processable event type");
        }
    }

    @RabbitListener(queues = QUEUE_VALIDATION_RESULT)
    public void validationResult(ValidationMqResponse response) {
        validationService.handleMqResponse(response);
    }

    @RabbitListener(queues = QUEUE_IMPORT_RESPONSE)
    public void importResponse(ImportMqResponse response) {
        importService.handleMqResponse(response);
    }

    @RabbitListener(queues = QUEUE_GML_RESPONSE)
    public void gmlResponse(GmlMqResponse response) {
        gmlGenerationService.handleMqResponse(response);
    }
}
