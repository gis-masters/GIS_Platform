package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.OrgInitOutbox;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.OrgInitOutboxRepository;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.service.organization.OrgInitOutboxReregistrationService;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class OrgDepProvisionFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgDepProvisionFailedEventHandler.class);

    private final OrgInitOutboxRepository outboxRepository;
    private final OrganizationRepository organizationRepository;
    private final OrgInitOutboxReregistrationService reregistrationService;

    public OrgDepProvisionFailedEventHandler(OrganizationRepository organizationRepository,
                                            OrgInitOutboxRepository outboxRepository,
                                            OrgInitOutboxReregistrationService reregistrationService) {
        this.outboxRepository = outboxRepository;
        this.reregistrationService = reregistrationService;
        this.organizationRepository = organizationRepository;
    }

    @Override
    public String getEventType() {
        return OrganizationDependencyProvisionFailedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            final Long orgId = ((OrganizationDependencyProvisionFailedEvent) mqEvent).getOrgId();

            organizationRepository
                    .findById(orgId)
                    .ifPresentOrElse(organization -> {
                        log.error("Ошибка при создании организации: {}. Перерегистрируем событие для повторной попытки.", orgId);

                        // Получаем событие из outbox для перерегистрации
                        OrgInitOutbox existingEvent = outboxRepository
                                .findByOrgId(orgId)
                                .orElseThrow(() -> new IllegalStateException("Событие outbox не найдено для организации: " + orgId));

                        // Перерегистрируем событие для повторной попытки создания организации
                        reregistrationService.reRegisterEvent(existingEvent);
                        log.info("Событие перерегистрировано для повторной попытки создания организации: orgId:{}", orgId);
                    }, () -> {
                        throw new EntityNotFoundException("Not found org by id: " + orgId);
                    });
        } catch (Exception e) {
            throw new AuthServiceException("Failed handle OrganizationDependencyProvisionFailedEvent", e.getCause());
        }
    }
}
