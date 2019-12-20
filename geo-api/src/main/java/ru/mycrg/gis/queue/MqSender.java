package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;

import static ru.mycrg.mq_queue_contract.config.MqProperties.*;

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
            case CREATE_PROJECT:
            case DELETE_PROJECT:    send(FANOUT_PROJECT_REQUEST, KEY_PROJECT_REQUEST, mqRequest);   break;
            case IMPORT:            send(FANOUT_IMPORT_INIT, KEY_IMPORT_INIT, mqRequest);           break;
            case VALIDATION:        send(FANOUT_VALIDATION_START, KEY_VALIDATION_START, mqRequest); break;
            case EXPORT:            send(FANOUT_GML_INIT, KEY_GML_INIT, mqRequest);                 break;
            default:
                log.warn("Unsupported mqRequest type: {}", mqRequest.getType());
        }
    }

    private void send(String fanout, String key, BaseMqProcessRequest payload) {
        log.debug("Send mqEvent with id: {} ", payload.getId());

        rabbitTemplate.convertAndSend(fanout, key, payload);
    }
}
