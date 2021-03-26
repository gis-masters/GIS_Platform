package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.auth_service_contract.events.response.UserProvisioningSucceedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;

import javax.transaction.Transactional;

@Service
@Transactional
public class UserProvisioningSucceedEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(UserProvisioningSucceedEventHandler.class);

    private final UserRepository userRepository;

    public UserProvisioningSucceedEventHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String getEventType() {
        return "UserProvisioningSucceedEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            final String login = ((UserProvisioningSucceedEvent) mqEvent).getLogin();

            log.debug("User {} CREATION_PROVISIONED", login);

            userRepository.activateUserByLogin(login);
        } catch (Exception e) {
            throw new AuthServiceException("Failed handle UserProvisioningSucceedEvent", e.getCause());
        }
    }
}
