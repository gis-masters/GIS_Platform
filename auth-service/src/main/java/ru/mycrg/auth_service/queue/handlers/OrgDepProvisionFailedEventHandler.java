package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import javax.persistence.EntityNotFoundException;

import static ru.mycrg.auth_service.service.organization.OrganizationStatus.PROVISIONING_FAILED;

@Service
@Transactional
public class OrgDepProvisionFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgDepProvisionFailedEventHandler.class);

    private final OrganizationRepository organizationRepository;

    public OrgDepProvisionFailedEventHandler(OrganizationRepository organizationRepository) {
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
                        log.error("Error PROVISIONING organization: {}", orgId);

                        organization.setStatus(PROVISIONING_FAILED.toString());
                        organizationRepository.delete(organization);
                    }, () -> {
                        throw new EntityNotFoundException("Not found org by id: " + orgId);
                    });
        } catch (Exception e) {
            throw new AuthServiceException("Failed handle OrganizationDependencyProvisionFailedEvent", e.getCause());
        }
    }
}
