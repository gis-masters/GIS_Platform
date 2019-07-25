package ru.mycrg.wrapper.queue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.config.MqProperties;
import ru.mycrg.wrapper.service.requests_handler.EventDispatcher;

@Service
public class MqListener {

    private final EventDispatcher eventDispatcher;

    public MqListener(EventDispatcher eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
    }

    @RabbitListener(queues = {
            MqProperties.QUEUE_ORG_INIT,
            MqProperties.QUEUE_IMPORT_INIT,
            MqProperties.QUEUE_VALIDATION_START,
            MqProperties.QUEUE_GML_INIT
    })
    public void catchEvents(final BaseMqProcessRequest mqRequest) {
        eventDispatcher.handleEvent(mqRequest);
    }

}
