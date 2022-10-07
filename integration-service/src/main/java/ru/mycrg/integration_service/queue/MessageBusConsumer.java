package ru.mycrg.integration_service.queue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusConsumer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.messagebus_starter.DefaultMessageBusConsumer;

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
            USER_REQUEST_QUEUE,
            ORG_REQUEST_QUEUE,
            AUDIT_REQUEST_QUEUE,
            FILE_REQUEST_QUEUE,
            DATA_TO_INTEGRATION_QUEUE,
            AUTH_TO_INTEGRATION_QUEUE
    })
    public void consume(IMessageBusEvent event) {
        messageBus.consume(event);
    }
}
