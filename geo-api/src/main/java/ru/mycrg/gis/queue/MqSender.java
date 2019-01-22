package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.EntityType;
import ru.mycrg.gis.dto.MqOrganizationInit;

import static ru.mycrg.gis.config.MqProperties.*;

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
        log.info("Send init event: {}", creationDto.toString());

        rabbitTemplate.convertAndSend(FANOUT_ORG_INIT, KEY_ORG_INIT, creationDto);
    }

    @Override
    public void startValidation(EntityType entityType) {
        log.info("Queue startValidation: ", entityType.getTableName());

        rabbitTemplate.convertAndSend(FANOUT_VALIDATION_START, KEY_VALIDATION_START, entityType);
    }

}
