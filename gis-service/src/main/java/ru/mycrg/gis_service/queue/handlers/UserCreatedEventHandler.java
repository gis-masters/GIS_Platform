package ru.mycrg.gis_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.auth_service_contract.events.request.UserCreatedEvent;
import ru.mycrg.auth_service_contract.events.response.UserProvisioningFailedEvent;
import ru.mycrg.auth_service_contract.events.response.UserProvisioningSucceedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

@Service
public class UserCreatedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(UserCreatedEventHandler.class);

    private final IMessageBusProducer messageBus;

    public UserCreatedEventHandler(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public String getEventType() {
        return "UserCreatedEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        UserCreatedEvent event = null;
        try {
            event = (UserCreatedEvent) mqEvent;

            log.debug("userCreatedEvent. {}", event.getLogin());

            UsersAndRolesService usersAndRolesService = new UsersAndRolesService(event.getToken());
            usersAndRolesService.createUser(event.getLogin(), event.getPassword());
            usersAndRolesService.associateUserWithRole(event.getLogin(), event.getRole());

            messageBus.produce(new UserProvisioningSucceedEvent(event));
        } catch (Exception e) {
            log.error("Не удалось создать пользователя на геосервере: ", e);

            messageBus.produce(new UserProvisioningFailedEvent(event));
        }
    }
}
