package ru.mycrg.wrapper.service.users;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IUserEvent;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.wrapper.service.requests_handler.IUserRequestHandler;

@Service
public class DeleteUserRequestHandler implements IUserRequestHandler {

    private final Logger log = LoggerFactory.getLogger(DeleteUserRequestHandler.class);

    private final UsersAndRolesService usersAndRolesService;

    public DeleteUserRequestHandler() {
        this.usersAndRolesService = new UsersAndRolesService();
    }

    @Override
    public void handle(IUserEvent mqEvent) {
        try {
            usersAndRolesService.deleteUser(mqEvent.getLogin());
        } catch (Exception e) {
            log.error("Не удалось удалить пользователя на геосервере: ", e);

            // TODO: Alert for manual handling
        }
    }
}
