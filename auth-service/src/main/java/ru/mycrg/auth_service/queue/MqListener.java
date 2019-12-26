package ru.mycrg.auth_service.queue;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_service.exeptions.AuthServiceException;
import ru.mycrg.auth_service.service.OrganizationEventHandler;
import ru.mycrg.auth_service_contract.IOrganizationEvent;

import static ru.mycrg.auth_service.config.RabbitConfiguration.RESPONSE_QUEUE;

@Component
@EnableRabbit
public class MqListener {

    @Autowired
    private OrganizationEventHandler eventHandler;

    @RabbitListener(queues = { RESPONSE_QUEUE })
    public void catchEvents(IOrganizationEvent event) {
        try {
            eventHandler.handle(event);
        } catch (Exception e) {
            throw new AuthServiceException("Error handle event", e.getCause());
        }
    }

}
