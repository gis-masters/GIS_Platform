package ru.mycrg.data_service.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;

import static ru.mycrg.mq_queue_contract.config.MqProperties.*;

@Component
@EnableRabbit
public class MqListener {

    public static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final ResponseHandlerFactory responseHandlerFactory;

    public MqListener(ResponseHandlerFactory responseHandlerFactory) {
        this.responseHandlerFactory = responseHandlerFactory;
    }

    @RabbitListener(queues = {
            QUEUE_VALIDATION_RESULT,
            QUEUE_IMPORT_RESPONSE,
            QUEUE_GML_RESPONSE
    })
    public void catchEvents(BaseMqProcessResponse mqResponse) {
        try {
            responseHandlerFactory
                    .getProcessHandler(mqResponse)
                    .handleMqResponse(mqResponse);
        } catch (Exception e) {
            log.error("Error handle response: {}", e.getMessage(), e.getCause());
        }
    }
}
