package ru.mycrg.auth_service.queue;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_service.exeptions.AuthServiceException;
import ru.mycrg.auth_service.service.OrganizationEventHandler;
import ru.mycrg.auth_service.service.UserEventHandler;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.IUserEvent;

import static ru.mycrg.auth_service.config.RabbitConfiguration.ORG_RESPONSE_QUEUE;
import static ru.mycrg.auth_service.config.RabbitConfiguration.USER_RESPONSE_QUEUE;

@Component
@EnableRabbit
public class MessageBusListener {

    private final UserEventHandler userEventHandler;
    private final OrganizationEventHandler orgEventHandler;

    public MessageBusListener(OrganizationEventHandler orgEventHandler, UserEventHandler userEventHandler) {
        this.orgEventHandler = orgEventHandler;
        this.userEventHandler = userEventHandler;
    }

    @RabbitListener(queues = {ORG_RESPONSE_QUEUE})
    public void catchOrganizationEvents(IOrganizationEvent event) {
        try {
            orgEventHandler.handle(event);
        } catch (Exception e) {
            throw new AuthServiceException("Error handle organization event", e.getCause());
        }
    }

    @RabbitListener(queues = {USER_RESPONSE_QUEUE})
    public void catchUsersEvents(IUserEvent event) {
        try {
            userEventHandler.handle(event);
        } catch (Exception e) {
            throw new AuthServiceException("Error handle user event", e.getCause());
        }
    }

}
