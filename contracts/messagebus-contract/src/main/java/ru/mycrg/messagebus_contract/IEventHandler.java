package ru.mycrg.messagebus_contract;

import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

/**
 * Represents a function that handles a {@link IMessageBusEvent}.
 */
public interface IEventHandler {

    /**
     * Returns the type of event {@link IMessageBusEvent} with which the handler works.
     *
     * @return event id
     */
    String getEventType();

    /**
     * Handle the given event.
     *
     * @param event the event to handle
     */
    void handle(IMessageBusEvent event);
}
