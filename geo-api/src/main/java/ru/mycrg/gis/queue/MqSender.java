package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.dto.MqOrganizationInit;

import static ru.mycrg.gis.config.MqProperties.*;

@Service
public class MqSender implements MqEvents {

    private static final Logger log = LoggerFactory.getLogger(MqEvents.class);

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

}
