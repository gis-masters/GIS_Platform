package ru.mycrg.wrapper.queue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.wrapper.service.requests_handler.EventDispatcher;

import static ru.mycrg.mq_queue_contract.config.MqProperties.*;
import static ru.mycrg.wrapper.config.RabbitConfig.REQUEST_QUEUE;

@Service
public class MqListener {

    private final EventDispatcher eventDispatcher;

    public MqListener(EventDispatcher eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
    }

    @RabbitListener(queues = {
            QUEUE_PROJECT_REQUEST,
            QUEUE_IMPORT_INIT,
            QUEUE_VALIDATION_START,
            QUEUE_GML_INIT
    })
    public void catchEvents(final BaseMqProcessRequest mqRequest) {
        eventDispatcher.handleEvent(mqRequest);
    }

    @RabbitListener(queues = { REQUEST_QUEUE })
    public void catchOrganizationEvents(final IOrganizationEvent mqEvent) {
        eventDispatcher.handleOrganizationEvent(mqEvent);
    }

}
