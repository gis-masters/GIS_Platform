package ru.mycrg.wrapper.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.IUserEvent;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;

import static ru.mycrg.mq_queue_contract.config.MqProperties.*;
import static ru.mycrg.wrapper.config.RabbitConfig.*;

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
            case DELETE_PROJECT:    send(FANOUT_PROJECT_RESPONSE, KEY_PROJECT_RESPONSE, mqResponse);    break;
            case IMPORT:            send(FANOUT_IMPORT_RESPONSE, KEY_IMPORT_RESPONSE, mqResponse);      break;
            case VALIDATION:        send(FANOUT_VALIDATION_RESULT, KEY_VALIDATION_RESULT, mqResponse);  break;
            case EXPORT:            send(FANOUT_GML_RESPONSE, KEY_IMPORT_RESPONSE, mqResponse);         break;
            default:
                log.warn("Unsupported mqResponse type: {}", mqResponse.getType());
        }

    }

    public void sendOrgEvent(IOrganizationEvent mqEvent) {
        rabbitTemplate.convertAndSend(ORG_RESPONSE_FANOUT, ORG_RESPONSE_KEY, mqEvent);
    }

    public void sendUserEvent(IUserEvent mqEvent) {
        rabbitTemplate.convertAndSend(USER_RESPONSE_FANOUT, USER_RESPONSE_KEY, mqEvent);
    }

    private void send(String fanout, String key, BaseMqProcessResponse payload) {
        log.debug("Send {} mqEvent with id: {} ", payload.getStatus(), payload.getId());

        rabbitTemplate.convertAndSend(fanout, key, payload);
    }

}
