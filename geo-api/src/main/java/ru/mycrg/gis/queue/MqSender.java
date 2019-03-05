package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.gis.dto.MqOrganizationInit;

import static ru.mycrg.common.config.MqProperties.*;

@Service
public class MqSender implements IMqEvents {

    private static final Logger log = LoggerFactory.getLogger(IMqEvents.class);

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void initCreation(MqOrganizationInit creationDto) {
        log.info("Send init orgCreation event: {}", creationDto.toString());

        rabbitTemplate.convertAndSend(FANOUT_ORG_INIT, KEY_ORG_INIT, creationDto);
    }

    @Override
    public void initImport(ImportMqRequest payload) {
        log.debug("Send init import event: {}/{}", payload.getId(), payload.getSourceResource().getTableName());

        rabbitTemplate.convertAndSend(FANOUT_IMPORT_INIT, KEY_IMPORT_INIT, payload);
    }

    @Override
    public void sendValidationRequest(ValidationMqRequest payload) {
        log.info("MQ sendValidationRequest: {}", payload.getId());

        rabbitTemplate.convertAndSend(FANOUT_VALIDATION_START, KEY_VALIDATION_START, payload);
    }

}
