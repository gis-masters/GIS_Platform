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
public class UserProvisioningSucceedEventHandler implements IResponseHandler {

    private static final Logger log = LoggerFactory.getLogger(UserProvisioningSucceedEventHandler.class);

    private final UserRepository userRepository;

    public UserProvisioningSucceedEventHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void handle(IAuthServiceEvent mqEvent) {
        final String userName = ((IUserEvent) mqEvent).getLogin();

        log.debug("User {} CREATION_PROVISIONED", userName);

        userRepository.activateUserByName(userName);
    }
}
