package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.queue.IResponseHandler;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.IAuthServiceEvent;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionFailedEvent;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import static ru.mycrg.auth_service.service.OrganizationStatus.PROVISIONING_FAILED;

@Service
@Transactional
public class OrgDepProvisionFailedEventHandler implements IResponseHandler {

    private static final Logger log = LoggerFactory.getLogger(OrgDepProvisionFailedEventHandler.class);

    private final OrganizationRepository organizationRepository;

    public OrgDepProvisionFailedEventHandler(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public void handle(IAuthServiceEvent mqEvent) {
        final IOrganizationEvent event = (OrganizationDependencyProvisionFailedEvent) mqEvent;

        organizationRepository
                .findById(event.getOrgId())
                .ifPresentOrElse(organization -> {
                    log.error("Error PROVISIONING organization: {}", event.getOrgId());

                    organization.setStatus(PROVISIONING_FAILED.toString());
                    organizationRepository.delete(organization);
                }, () -> {
                    throw new EntityNotFoundException("Not found org by id: " + event.getOrgId());
                });
    }
}
