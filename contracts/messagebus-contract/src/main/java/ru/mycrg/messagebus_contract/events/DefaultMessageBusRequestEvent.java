package ru.mycrg.messagebus_contract.events;

import java.util.UUID;

public class DefaultMessageBusRequestEvent implements IMessageBusEvent {

    private final UUID id;
    private final String exchange;
    private final String routingKey;

    public DefaultMessageBusRequestEvent() {
        this.id = UUID.randomUUID();
        this.exchange = null;
        this.routingKey = null;
    }

    public DefaultMessageBusRequestEvent(UUID id, String exchange, String routingKey) {
        this.id = id;
        this.exchange = exchange;
        this.routingKey = routingKey;
    }

    public DefaultMessageBusRequestEvent(UUID id, String exchange) {
        this.id = id;
        this.exchange = exchange;
        this.routingKey = null;
    }

    @Override
    public UUID getId() {
        return this.id;
    }

    @Override
    public String getExchange() {
        return this.exchange;
    }

    @Override
    public String getRoutingKey() {
        return this.routingKey;
    }

    @Override
    public String toString() {
        return "{" +
                "  class: '" + this.getClass().getSimpleName() + "'," +
                "  id: '" + id + "'," +
                "  exchange: '" + exchange + "'," +
                "  routingKey: '" + routingKey + "'" +
                '}';
    }
}
