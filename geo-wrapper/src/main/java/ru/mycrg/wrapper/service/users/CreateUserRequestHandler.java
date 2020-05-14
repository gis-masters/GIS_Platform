package ru.mycrg.wrapper.service.users;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IUserEvent;
import ru.mycrg.auth_service_contract.UserCreatedEvent;
import ru.mycrg.auth_service_contract.UserProvisioningFailedEvent;
import ru.mycrg.auth_service_contract.UserProvisioningSucceedEvent;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.requests_handler.IUserRequestHandler;

@Service
public class CreateUserRequestHandler implements IUserRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateUserRequestHandler.class);

    private final MqSender mqSender;
    private final UsersAndRolesService usersAndRolesService;

    public CreateUserRequestHandler(MqSender mqSender) {
        this.mqSender = mqSender;
        this.usersAndRolesService = new UsersAndRolesService();
    }

    @Override
    public void handle(IUserEvent mqEvent) {
        try {
            UserCreatedEvent event = (UserCreatedEvent) mqEvent;

            log.debug("userCreatedEvent. {}", event.getLogin());

            usersAndRolesService.createUser(event.getLogin(), event.getPassword());
            usersAndRolesService.associateUserWithRole(event.getLogin(), event.getRole());

            mqSender.sendUserEvent(new UserProvisioningSucceedEvent(mqEvent));
        } catch (Exception e) {
            log.error("Не удалось создать пользователя на геосервере: ", e);

            mqSender.sendUserEvent(new UserProvisioningFailedEvent(mqEvent));
        }
    }
}
