package ru.mycrg.auth_service.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_service_contract.IAuthServiceEvent;

import static ru.mycrg.auth_service.config.RabbitConfiguration.ORG_RESPONSE_QUEUE;
import static ru.mycrg.auth_service.config.RabbitConfiguration.USER_RESPONSE_QUEUE;

@Component
@EnableRabbit
public class MessageBusListener {

    private final Logger log = LoggerFactory.getLogger(MessageBusListener.class);

    private final ResponseHandlerFactory responseHandlerFactory;

    public MessageBusListener(ResponseHandlerFactory responseHandlerFactory) {
        this.responseHandlerFactory = responseHandlerFactory;
    }

    @RabbitListener(queues = {ORG_RESPONSE_QUEUE, USER_RESPONSE_QUEUE})
    public void catchEvents(IAuthServiceEvent event) {
        try {
            responseHandlerFactory
                    .getHandler(event)
                    .handle(event);
        } catch (Exception e) {
            log.error("Error handle response event: {}", e.getMessage());
        }
    }

}
