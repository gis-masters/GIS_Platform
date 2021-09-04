package ru.mycrg.auth_service.queue;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.messagebus_starter.DefaultMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

@Service
public class MessageBusProducer implements IMessageBusProducer {

    IMessageBusProducer messageBus;

    public MessageBusProducer(RabbitTemplate rabbitTemplate) {
        messageBus = new DefaultMessageBusProducer(rabbitTemplate);
    }

    @Override
    public void produce(IMessageBusEvent event) {
        messageBus.produce(event);
    }
}
