package ru.mycrg.messagebus_contract;

import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

/**
 * Listener interface to consume message bus events.
 */
public interface IMessageBusConsumer {

    /**
     * Consume an message bus event.
     *
     * @param event an message bus event
     * @throws MessagebusException if there is a problem
     */
    void consume(IMessageBusEvent event);
}
