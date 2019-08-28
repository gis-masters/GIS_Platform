package ru.mycrg.wrapper.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;

import static ru.mycrg.common.config.MqProperties.*;

@Service
public class MqSender {

    private static final Logger log = LoggerFactory.getLogger(MqSender.class);

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(BaseMqProcessResponse mqResponse) {
        switch (mqResponse.getType()) {
            case CREATE_PROJECT:
            case DELETE_PROJECT:
            case CREATE_ORG:        send(FANOUT_ORG_CREATED, KEY_ORG_CREATED, mqResponse);              break;
            case IMPORT:            send(FANOUT_IMPORT_RESPONSE, KEY_IMPORT_RESPONSE, mqResponse);      break;
            case VALIDATION:        send(FANOUT_VALIDATION_RESULT, KEY_VALIDATION_RESULT, mqResponse);  break;
            case EXPORT:            send(FANOUT_GML_RESPONSE, KEY_IMPORT_RESPONSE, mqResponse);         break;
            default:
                log.warn("Unsupported mqResponse type: {}", mqResponse.getType());
        }

    }

    private void send(String fanout, String key, BaseMqProcessResponse payload) {
        log.debug("Send {} mqEvent with id: {} ", payload.getStatus(), payload.getId());

        rabbitTemplate.convertAndSend(fanout, key, payload);
    }

}
