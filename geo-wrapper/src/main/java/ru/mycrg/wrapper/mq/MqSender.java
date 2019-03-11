package ru.mycrg.wrapper.mq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.GmlResponseDto;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.config.MqProperties;
import ru.mycrg.common.import_.ImportMqResponse;

import java.util.List;

@Service
public class MqSender implements IMqEvents {

    private static final Logger log = LoggerFactory.getLogger(MqSender.class);

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void created(Long msg) {
        log.info("Send created event: {}", msg);

        rabbitTemplate.convertAndSend(MqProperties.FANOUT_ORG_CREATED, MqProperties.KEY_ORG_CREATED, msg);
    }

    @Override
    public void validationResponse(ValidationMqResponse response) {
        log.info("Send {} response: {}", response.getStatus(), response.getId());

        rabbitTemplate.convertAndSend(MqProperties.FANOUT_VALIDATION_RESULT, MqProperties.KEY_VALIDATION_RESULT, response);
    }

    @Override
    public void importResponse(ImportMqResponse payload) {
        log.debug("Send {} response: {} / {}", payload.getId(), payload.getLayerName(), payload.getStatus());

        rabbitTemplate.convertAndSend(MqProperties.FANOUT_IMPORT_RESPONSE, MqProperties.KEY_IMPORT_RESPONSE, payload);
    }

    @Override
    public void gmlResponse(GmlResponseDto payload) {
        log.debug("Send gml response");

        rabbitTemplate.convertAndSend(MqProperties.FANOUT_GML_RESPONSE, MqProperties.KEY_GML_RESPONSE, payload);
    }

}
