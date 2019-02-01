package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.gis.dto.MqOrganizationInit;

import java.util.Optional;

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
        log.info("Send init event: {}", creationDto.toString());

        rabbitTemplate.convertAndSend(FANOUT_ORG_INIT, KEY_ORG_INIT, creationDto);
    }

    @Override
    public void startValidation(Optional<ValidationMqRequest> payload) {
        payload.ifPresent(validationMqRequest -> {
            log.info("Queue startValidation");

            rabbitTemplate.convertAndSend(FANOUT_VALIDATION_START, KEY_VALIDATION_START, payload.get());
        });
    }

}
