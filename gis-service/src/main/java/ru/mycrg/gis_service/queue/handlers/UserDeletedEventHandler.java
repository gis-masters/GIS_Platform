package ru.mycrg.gis_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.auth_service_contract.events.request.UserDeletedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;

@Service
public class UserDeletedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(UserDeletedEventHandler.class);

    @Override
    public String getEventType() {
        return "UserDeletedEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            UserDeletedEvent event = (UserDeletedEvent) mqEvent;

            new UsersAndRolesService(event.getToken())
                    .deleteUser(event.getLogin());
        } catch (Exception e) {
            log.error("Не удалось удалить пользователя на геосервере: ", e);

            // TODO: Alert or manual handling
        }
    }
}
