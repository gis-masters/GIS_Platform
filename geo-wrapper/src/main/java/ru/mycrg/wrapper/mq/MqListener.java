package ru.mycrg.wrapper.mq;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.config.MqProperties;
import ru.mycrg.common.enums.ValidationStatus;
import ru.mycrg.wrapper.dto.MqOrganizationInit;
import ru.mycrg.wrapper.dto.PostgreEvent;
import ru.mycrg.wrapper.service.geoserver.AuthService;
import ru.mycrg.wrapper.service.geoserver.IGeoServer;
import ru.mycrg.wrapper.service.validation.ValidationService;

import java.io.IOException;

@Service
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final IMqEvents mqEvents;
    private final IGeoServer geoServer;
    private final AuthService authService;
    private final ValidationService validationService;

    @Autowired
    public MqListener(IMqEvents mqEvents, IGeoServer geoServer, AuthService authService,
                      ValidationService validationService) {
        this.mqEvents = mqEvents;
        this.geoServer = geoServer;
        this.authService = authService;
        this.validationService = validationService;
    }

    @RabbitListener(queues = MqProperties.QUEUE_ORG_INIT)
    public void initOrganization(final MqOrganizationInit creationDto) {
        log.info("initCreation. Получено сообщение {}", creationDto.toString());

        try {
            if (authService.authorize().isPresent()) {
                try {
                    geoServer.createOrganization(creationDto.getId(), creationDto.getRawPassword());

                    mqEvents.created(creationDto.getId());
                } catch (IOException | RuntimeException e) {
                    log.error("Неудалось создать организацию на геосервере: ", e);
                }
            }
        } catch (IOException e) {
            log.error("Неудалось создать организацию на геосервере: ", e);
        }
    }

    @RabbitListener(queues = MqProperties.QUEUE_VALIDATION_START)
    public void startValidation(final ValidationMqRequest validationMqRequest) {
        log.info("Получено сообщение, startValidation: {}", validationMqRequest.getId());

        try {
            validationService.startValidation(validationMqRequest);
        } catch (Exception e) {
            log.error("Неудалось провалидировать.", e);
            mqEvents.validationResponse(new ValidationMqResponse(ValidationStatus.ERROR));
        }
    }

    @RabbitListener(queues = MqProperties.QUEUE_POSTGRE_VALIDATION)
    public void postgreMsg(char[] any) {
        StringBuilder result = new StringBuilder();
        for (char c : any) {
            result.append(c);
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            PostgreEvent postgreEvent = mapper.readValue(result.toString(), PostgreEvent.class);

            log.info("Получено сообщение, from postgresql: {}", postgreEvent.getObjectid());

//            Thread.sleep(1000);
        } catch (IOException e) {
            log.error("Не удалось распарсить сообщение: {}", result);
        }
    }

}
