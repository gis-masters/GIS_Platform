package ru.mycrg.data_service.queue;

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
            QUEUE_VALIDATION_RESULT,
            QUEUE_IMPORT_RESPONSE,
            QUEUE_EXPORT_RESPONSE,
            COMMON_RESPONSE_QUEUE,
            INTEGRATION_TO_DATA_QUEUE,
            AUTH_TO_DATA_QUEUE,
            GEO_WRAPPER_TO_DATA_QUEUE,
            GISOGD_PUBLICATION_RESPONSE_QUEUE,
            GISOGD_AUDIT_RESPONSE_QUEUE,
            SYSTEM_TAGS_REQUEST_QUEUE
    })
    public void consume(IMessageBusEvent event) {
        messageBus.consume(event);
    }
}
