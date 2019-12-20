package ru.mycrg.auth_service.queue;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;

import static ru.mycrg.auth_service.config.RabbitConfiguration.REQUEST_FANOUT;
import static ru.mycrg.auth_service.config.RabbitConfiguration.REQUEST_KEY;

@Service
public class MqSender {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(IOrganizationEvent mqEvent) {
        rabbitTemplate.convertAndSend(REQUEST_FANOUT, REQUEST_KEY, mqEvent);
    }

}
