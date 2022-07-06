package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyRemovingSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Service
@Transactional
public class OrgDepRemovingSuccessEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgDepRemovingSuccessEventHandler.class);

    private final OrganizationRepository organizationRepository;

    public OrgDepRemovingSuccessEventHandler(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Override
    public String getEventType() {
        return "OrganizationDependencyRemovingSucceededEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            final Long orgId = ((OrganizationDependencyRemovingSucceededEvent) mqEvent).getOrgId();

            organizationRepository.deleteById(orgId);

            log.debug("Organization {} successfully deleted", orgId);
        } catch (Exception e) {
            throw new AuthServiceException("Failed handle OrganizationDependencyRemovingSucceededEvent", e.getCause());
        }
    }
}
