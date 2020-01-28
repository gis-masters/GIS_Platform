package ru.mycrg.gis.queue;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;

import static ru.mycrg.mq_queue_contract.config.MqProperties.*;

@Component
@EnableRabbit
public class MqListener {

    private final EventDispatcher eventDispatcher;

    public MqListener(EventDispatcher eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
    }

    @RabbitListener(queues = {
            QUEUE_VALIDATION_RESULT,
            QUEUE_IMPORT_RESPONSE,
            QUEUE_GML_RESPONSE
    })
    public void catchEvents(BaseMqProcessResponse response) {
        eventDispatcher.handleEvent(response);
    }

}
