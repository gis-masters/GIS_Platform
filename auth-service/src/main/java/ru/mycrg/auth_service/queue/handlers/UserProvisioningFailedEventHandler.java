package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.auth_service_contract.events.response.UserProvisioningFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;

@Service
@Transactional
public class UserProvisioningFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(UserProvisioningFailedEventHandler.class);

    private final UserRepository userRepository;

    public UserProvisioningFailedEventHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String getEventType() {
        return UserProvisioningFailedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            final String login = ((UserProvisioningFailedEvent) mqEvent).getLogin();

            log.debug("User {} CREATION_PROVISIONING_FAILED", login);

            userRepository.deleteByLogin(login);
        } catch (Exception e) {
            throw new AuthServiceException("Failed handle UserProvisioningFailedEvent", e.getCause());
        }
    }
}
