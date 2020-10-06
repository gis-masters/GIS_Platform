package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.queue.IResponseHandler;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.IAuthServiceEvent;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyRemovingSucceededEvent;

import javax.transaction.Transactional;

@Service
@Transactional
public class OrgDepRemovingSuccessEventHandler implements IResponseHandler {

    private static final Logger log = LoggerFactory.getLogger(OrgDepRemovingSuccessEventHandler.class);

    private final OrganizationRepository organizationRepository;

    public OrgDepRemovingSuccessEventHandler(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public void handle(IAuthServiceEvent mqEvent) {
        final IOrganizationEvent event = (OrganizationDependencyRemovingSucceededEvent) mqEvent;

        organizationRepository.deleteById(event.getOrgId());

        log.debug("Organization {} successfully deleted", event.getOrgId());
    }
}
