package ru.mycrg.integration_service.queue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;

import static ru.mycrg.integration_service.config.RabbitConfig.ORG_REQUEST_QUEUE;

@Service
public class MessageBusListener {

    private final EventDispatcher eventDispatcher;

    public MessageBusListener(EventDispatcher eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
    }

    @RabbitListener(queues = {ORG_REQUEST_QUEUE})
    public void catchOrganizationEvents(final IOrganizationEvent mqEvent) {
        eventDispatcher.handleOrganizationEvent(mqEvent);
    }

}
