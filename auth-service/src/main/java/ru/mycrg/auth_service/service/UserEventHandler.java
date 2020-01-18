package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.exeptions.AuthServiceException;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.*;

import javax.transaction.Transactional;

@Service
@Transactional
public class UserEventHandler {

    private static Logger log = LoggerFactory.getLogger(UserEventHandler.class);

    private static final String USER_PROVISIONED = "CREATION_PROVISIONED";
    private static final String USER_PROVISIONING_FAILED = "CREATION_PROVISIONING_FAILED";

    private final UserRepository userRepository;

    public UserEventHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void handle(IUserEvent mqEvent) {
        String userName = mqEvent.getLogin();

        String status = "";
        if (mqEvent instanceof UserProvisioningSucceedEvent) {
            status = USER_PROVISIONED;
        } else if (mqEvent instanceof UserProvisioningFailedEvent) {
            status = USER_PROVISIONING_FAILED;
        }

        log.info("For user {} handle event {}", userName, status);

        switch (status) {
            case USER_PROVISIONED:
                log.debug("User {} CREATION_PROVISIONED", userName);

                userRepository.activateUserByName(userName);

                break;
            case USER_PROVISIONING_FAILED:
                log.info("CREATION_PROVISIONING_FAILED user {} deleted", userName);

                userRepository.deleteByUsername(userName);

                break;
            default:
                throw new AuthServiceException("Not supported event status: " + status);
        }
    }
}
