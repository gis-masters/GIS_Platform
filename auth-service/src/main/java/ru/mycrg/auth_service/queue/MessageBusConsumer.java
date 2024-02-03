package ru.mycrg.auth_service.queue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ru.mycrg.messagebus_starter.DefaultMessageBusConsumer;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusConsumer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.List;

import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

@Service
public class MessageBusConsumer implements IMessageBusConsumer {

    private final IMessageBusConsumer messageBus;

    public MessageBusConsumer(List<IEventHandler> handlers) {
        messageBus = new DefaultMessageBusConsumer(handlers);
    }

    @Override
    @RabbitListener(queues = {
            ORG_RESPONSE_QUEUE,
            USER_RESPONSE_QUEUE,
            SYSTEM_TAGS_UPDATED_QUEUE
    })
    public void consume(IMessageBusEvent event) {
        messageBus.consume(event);
    }
}
