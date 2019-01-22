package ru.geoserver.mq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.geoserver.config.MqProperties;
import ru.geoserver.dto.MqOrganizationInit;
import ru.geoserver.service.AuthService;
import ru.geoserver.service.IGeoServer;

import java.io.IOException;
import java.util.ArrayList;

@Service
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final IMqEvents mqEvents;
    private final IGeoServer geoServer;
    private final AuthService authService;

    @Autowired
    public MqListener(IMqEvents mqEvents, IGeoServer geoServer, AuthService authService) {
        this.mqEvents = mqEvents;
        this.geoServer = geoServer;
        this.authService = authService;
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
    public void startValidation(final EntityType entityType) {
        log.info("startValidation. Получено сообщение");

        try {
            mqEvents.validationResponse(new ArrayList<>());
        } catch (Exception e) {
            log.error("Неудалось провалидировать.", e);
        }
    }

}
