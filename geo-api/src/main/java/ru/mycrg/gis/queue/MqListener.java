package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.gis.service.OrganizationService;
import ru.mycrg.gis.service.gml.GmlGenerationService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.validation.IValidationService;

import static ru.mycrg.common.config.MqProperties.*;

@Component
@EnableRabbit
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final IValidationService validationService;
    private final ImportService importService;
    private final GmlGenerationService gmlGenerationService;
    private final OrganizationService organizationService;

    @Autowired
    public MqListener(OrganizationService organizationService,
                      IValidationService validationService,
                      ImportService importService,
                      GmlGenerationService gmlGenerationService) {
        this.organizationService = organizationService;
        this.validationService = validationService;
        this.importService = importService;
        this.gmlGenerationService = gmlGenerationService;
    }

    @RabbitListener(queues = QUEUE_ORG_CREATED)
    public void created(Long id) {
        log.info("Создана организация с id: {}", id);

        organizationService.organizationCreated(id);
    }

    @RabbitListener(queues = QUEUE_VALIDATION_RESULT)
    public void validationResult(ValidationMqResponse response) {
        validationService.progress(response);
    }

    @RabbitListener(queues = QUEUE_IMPORT_RESPONSE)
    public void importResponse(ImportMqResponse response) {
        importService.progress(response);
    }

    @RabbitListener(queues = QUEUE_GML_RESPONSE)
    public void gmlResponse(GmlMqResponse response) {
        log.info("gmlResponse: {}", response.getId());

        gmlGenerationService.progress(response);
    }
}
