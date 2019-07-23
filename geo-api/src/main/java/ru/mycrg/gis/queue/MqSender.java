package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;

import static ru.mycrg.common.config.MqProperties.*;

@Service
public class MqSender {

    private static final Logger log = LoggerFactory.getLogger(MqSender.class);

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(BaseMqProcessRequest mqRequest) {
        switch (mqRequest.getType()) {
            case CREATE_ORG:    send(FANOUT_ORG_INIT, KEY_ORG_INIT, mqRequest);
            case IMPORT:        send(FANOUT_IMPORT_INIT, KEY_IMPORT_INIT, mqRequest);
            case VALIDATION:    send(FANOUT_VALIDATION_START, KEY_VALIDATION_START, mqRequest);
            case EXPORT:        send(FANOUT_GML_INIT, KEY_GML_INIT, mqRequest);
            default:
                log.warn("Unsupported mqRequest type");
        }
    }

    private void send(String fanout, String key, BaseMqProcessRequest payload) {
        log.debug("Send mqEvent with id: {} ", payload.getId());

        rabbitTemplate.convertAndSend(fanout, key, payload);
    }
}
