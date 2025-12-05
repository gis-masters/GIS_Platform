package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.events.response.UserProvisioningSucceedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.function.Consumer;

import static ru.mycrg.http_client.JsonConverter.toJsonNode;

@Service
public class UserProvisioningSucceedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(UserProvisioningSucceedEventHandler.class);

    private final UserRepository userRepository;
    private final IMessageBusProducer messageBus;
    private final ProjectionFactory projectionFactory;

    public UserProvisioningSucceedEventHandler(UserRepository userRepository,
                                               IMessageBusProducer messageBus,
                                               ProjectionFactory projectionFactory) {
        this.userRepository = userRepository;
        this.messageBus = messageBus;
        this.projectionFactory = projectionFactory;
    }

    @Override
    public String getEventType() {
        return UserProvisioningSucceedEvent.class.getSimpleName();
    }

    @Override
    @Transactional
    public void handle(IMessageBusEvent mqEvent) {
        try {
            UserProvisioningSucceedEvent event = (UserProvisioningSucceedEvent) mqEvent;
            String login = event.getLogin();
            String accessToken = event.getToken();

            log.debug("User {} CREATION_PROVISIONED", login);

            userRepository.activateUserByLogin(login);
            userRepository.findByLoginIgnoreCase(login)
                          .ifPresentOrElse(
                                  publishToAudit(accessToken, login),
                                  logError(login));
        } catch (Exception e) {
            throw new AuthServiceException("Не удалось обработать событие UserProvisioningSucceedEvent", e.getCause());
        }
    }

    private Consumer<User> publishToAudit(String accessToken, String login) {
        return user -> {
            try {
                UserProjection projection = projectionFactory.createProjection(UserProjection.class, user);

                messageBus.produce(new CrgAuditEvent(accessToken,
                                                     "CREATE",
                                                     login,
                                                     "USER",
                                                     user.getId(),
                                                     toJsonNode(projection)));
            } catch (Exception e) {
                log.error("Не удалось отправить событие создания пользователя в аудит => {}", e.getMessage(), e);
            }
        };
    }

    private Runnable logError(String login) {
        return () -> {
            log.error("Пришло событие об успешном создании пользователя, но не удалось его найти по" +
                              " логину: '{}'", login);
        };
    }
}
