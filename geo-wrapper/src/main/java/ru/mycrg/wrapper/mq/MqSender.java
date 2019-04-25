package ru.mycrg.wrapper.mq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqResponse;
import ru.mycrg.common.config.MqProperties;

@Service
public class MqSender implements IMqEvents {

    private static final Logger log = LoggerFactory.getLogger(MqSender.class);

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void orgEventResponse(OrgMqResponse response) {
        log.info("Send created event: {}:{}", response.getId(), response.getStatus());

        // TODO: привести к общему виду
        rabbitTemplate.convertAndSend(MqProperties.FANOUT_ORG_CREATED, MqProperties.KEY_ORG_CREATED, response);
    }

    @Override
    public void validationResponse(BaseMqProcessResponse response) {
        send(MqProperties.FANOUT_VALIDATION_RESULT, MqProperties.KEY_VALIDATION_RESULT, response);
    }

    @Override
    public void importResponse(BaseMqProcessResponse payload) {
        send(MqProperties.FANOUT_IMPORT_RESPONSE, MqProperties.KEY_IMPORT_RESPONSE, payload);
    }

    @Override
    public void gmlResponse(BaseMqProcessResponse payload) {
        send(MqProperties.FANOUT_GML_RESPONSE, MqProperties.KEY_GML_RESPONSE, payload);
    }

    private void send(String fanout, String key, BaseMqProcessResponse payload) {
        log.debug("Send {} status: {}", payload.getId(), payload.getStatus());

        rabbitTemplate.convertAndSend(fanout, key, payload);
    }

}
