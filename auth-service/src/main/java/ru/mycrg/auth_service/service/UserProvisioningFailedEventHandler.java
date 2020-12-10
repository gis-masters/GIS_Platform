package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.queue.IResponseHandler;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.IAuthServiceEvent;
import ru.mycrg.auth_service_contract.IUserEvent;

import javax.transaction.Transactional;

@Service
@Transactional
public class UserProvisioningFailedEventHandler implements IResponseHandler {

    private static final Logger log = LoggerFactory.getLogger(UserProvisioningFailedEventHandler.class);

    private final UserRepository userRepository;

    public UserProvisioningFailedEventHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void handle(IAuthServiceEvent mqEvent) {
        final String login = ((IUserEvent) mqEvent).getLogin();

        log.debug("User {} CREATION_PROVISIONING_FAILED", login);

        userRepository.deleteByLogin(login);
    }
}
