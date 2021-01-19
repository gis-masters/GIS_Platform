package ru.mycrg.integration_service.queue;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.integration_service.domain.IOrganizationRequestHandler;
import ru.mycrg.integration_service.domain.RequestHandlerFactory;

/**
 * Данный диспетчер находит нужный обработчик запроса, имплементирующий {@link IOrganizationRequestHandler} <p>
 * Отправляет ответ об ошибке в случае если обработчик не найден.
 */
@Service
public class EventDispatcher {

    private static final Logger log = LoggerFactory.getLogger(EventDispatcher.class);

    private final MessageBusSender messageBusSender;
    private final RequestHandlerFactory requestHandlerFactory;

    public EventDispatcher(RequestHandlerFactory requestHandlerFactory, MessageBusSender messageBusSender) {
        this.messageBusSender = messageBusSender;
        this.requestHandlerFactory = requestHandlerFactory;
    }

    public void handleOrganizationEvent(@NotNull IOrganizationEvent mqEvent) {
        log.debug("handle organization event: {}", mqEvent.getOrgId());

        try {
            requestHandlerFactory
                    .getOrgHandler(mqEvent)
                    .handle(mqEvent);
        } catch (Exception e) {
            messageBusSender.sendOrgEvent(new OrganizationDependencyProvisionFailedEvent(mqEvent));
        }
    }
}
