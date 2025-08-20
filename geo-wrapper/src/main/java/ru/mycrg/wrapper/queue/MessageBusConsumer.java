package ru.mycrg.wrapper.queue;

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
            QUEUE_IMPORT_INIT,
            QUEUE_VALIDATION_START,
            QUEUE_EXPORT_INIT,
            DATA_TO_GEO_WRAPPER_QUEUE
    })
    public void consume(IMessageBusEvent event) {
        messageBus.consume(event);
    }
}
