package ru.mycrg.auth_service.queue;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.IUserEvent;

import static ru.mycrg.auth_service.config.RabbitConfiguration.ORG_REQUEST_FANOUT;
import static ru.mycrg.auth_service.config.RabbitConfiguration.ORG_REQUEST_KEY;

import static ru.mycrg.auth_service.config.RabbitConfiguration.USER_REQUEST_FANOUT;
import static ru.mycrg.auth_service.config.RabbitConfiguration.USER_REQUEST_KEY;

@Service
public class MessageBus {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MessageBus(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendOrgEvent(IOrganizationEvent mqEvent) {
        rabbitTemplate.convertAndSend(ORG_REQUEST_FANOUT, ORG_REQUEST_KEY, mqEvent);
    }

    public void sendUserEvent(IUserEvent mqEvent) {
        rabbitTemplate.convertAndSend(USER_REQUEST_FANOUT, USER_REQUEST_KEY, mqEvent);
    }

}
