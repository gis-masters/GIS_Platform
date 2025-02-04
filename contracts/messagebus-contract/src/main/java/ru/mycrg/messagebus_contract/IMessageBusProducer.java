package ru.mycrg.messagebus_contract;

import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

/**
 * Provides methods to produce events {@link IMessageBusEvent}.
 */
public interface IMessageBusProducer {

    /**
     * Produce an event.
     *
     * @param event an event to send
     */
    void produce(IMessageBusEvent event);
}
