package ru.mycrg.messagebus_starter;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

public class DefaultMessageBusProducer implements IMessageBusProducer {

    private final RabbitTemplate rabbitTemplate;

    public DefaultMessageBusProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void produce(IMessageBusEvent event) {
        if (event.getRoutingKey() == null) {
            rabbitTemplate.convertAndSend(event.getExchange(), event);
        } else {
            rabbitTemplate.convertAndSend(event.getExchange(), event.getRoutingKey(), event);
        }
    }
}
