package ru.mycrg.integration_service.queue;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;

import static ru.mycrg.integration_service.config.RabbitConfig.ORG_RESPONSE_FANOUT;
import static ru.mycrg.integration_service.config.RabbitConfig.ORG_RESPONSE_KEY;

@Service
public class MessageBusSender {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MessageBusSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendOrgEvent(IOrganizationEvent mqEvent) {
        rabbitTemplate.convertAndSend(ORG_RESPONSE_FANOUT, ORG_RESPONSE_KEY, mqEvent);
    }

}
