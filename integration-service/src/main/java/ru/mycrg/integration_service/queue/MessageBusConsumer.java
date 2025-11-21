package ru.mycrg.integration_service.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusConsumer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.messagebus_starter.DefaultEventHandler;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

@Service
public class MessageBusConsumer implements IMessageBusConsumer {

    private static final Logger log = LoggerFactory.getLogger(MessageBusConsumer.class);

    private final IEventHandler defaultHandler;
    private final Map<String, IEventHandler> eventHandlers;

    public MessageBusConsumer(List<IEventHandler> handlers) {
        this.defaultHandler = new DefaultEventHandler();
        this.eventHandlers = handlers.stream()
                                     .collect(toMap(IEventHandler::getEventType, Function.identity()));
    }

    @Override
    @RabbitListener(
            queues = {
                    USER_REQUEST_QUEUE,
                    ORG_REQUEST_QUEUE,
                    AUDIT_REQUEST_QUEUE,
                    FILE_REQUEST_QUEUE,
                    DATA_TO_INTEGRATION_QUEUE,
                    AUTH_TO_INTEGRATION_QUEUE,
                    GEO_WRAPPER_TO_INTEGRATION_QUEUE
            },
            containerFactory = "retryContainerFactory"
    )
    public void consume(IMessageBusEvent event) {
        try {
            eventHandlers.getOrDefault(event.getClass().getSimpleName(), defaultHandler)
                         .handle(event);
        } catch (Exception e) {
            log.error("Failed consume event: {}:{}", event.getClass().getSimpleName(), event.getId(), e);

            throw e;
        }
    }
}
