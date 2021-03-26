package ru.mycrg.messagebus_contract.events;

import java.util.UUID;

/**
 * The root interface of the components that will be produced to the message bus.
 */
public interface IMessageBusEvent {

    /**
     * UUID trace identifier.
     *
     * @return UUID event identifier
     */
    UUID getId();

    /**
     * The name of the exchange.
     */
    String getExchange();

    /**
     * The routing key
     */
    String getRoutingKey();
}
