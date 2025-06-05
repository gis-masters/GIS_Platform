package ru.mycrg.messagebus_starter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusConsumer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

public class DefaultMessageBusConsumer implements IMessageBusConsumer {

    private final Logger log = LoggerFactory.getLogger(DefaultMessageBusConsumer.class);

    private final IEventHandler defaultHandler;
    private final Map<String, IEventHandler> eventHandlers;

    public DefaultMessageBusConsumer(List<IEventHandler> handlers) {
        this.defaultHandler = new DefaultEventHandler();
        this.eventHandlers = handlers.stream()
                                     .collect(toMap(IEventHandler::getEventType, Function.identity()));
    }

    public DefaultMessageBusConsumer(List<IEventHandler> handlers, IEventHandler defaultHandler) {
        this.defaultHandler = defaultHandler;
        this.eventHandlers = handlers.stream()
                                     .collect(toMap(IEventHandler::getEventType, Function.identity()));
    }

    @Override
    public void consume(IMessageBusEvent event) {
        try {
            eventHandlers.getOrDefault(event.getClass().getSimpleName(), defaultHandler)
                         .handle(event);
        } catch (Exception e) {
            log.error("Failed consume event: {}:{}", event.getClass().getSimpleName(), event.getId(), e.getCause());
        }
    }
}
