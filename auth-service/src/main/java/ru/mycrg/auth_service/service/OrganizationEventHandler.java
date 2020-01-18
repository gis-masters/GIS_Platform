package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.AuthServiceException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionSucceededEvent;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@Service
@Transactional
public class OrganizationEventHandler {

    private static Logger log = LoggerFactory.getLogger(OrganizationEventHandler.class);

    private static final String PROVISIONED = "PROVISIONED";
    private static final String PROVISIONING_FAILED = "PROVISIONING_FAILED";

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public OrganizationEventHandler(UserRepository userRepository, OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    public void handle(IOrganizationEvent mqEvent) {
        String status = "";
        if (mqEvent instanceof OrganizationDependencyProvisionSucceededEvent) {
            status = PROVISIONED;
        } else if (mqEvent instanceof OrganizationDependencyProvisionFailedEvent) {
            status = PROVISIONING_FAILED;
        }

        Long orgId = mqEvent.getOrgId();
        log.debug("Mq mqResponse. Organization: {}", orgId);

        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new EntityNotFoundException("Not found org by id: " + orgId));

        switch (status) {
            case PROVISIONING_FAILED: {
                log.error("Error PROVISIONING organization: {}", orgId);

                organization.setStatus(PROVISIONING_FAILED);
                organizationRepository.delete(organization);
            }
            break;
            case PROVISIONED: {
                organization.setStatus(PROVISIONED);
                organizationRepository.save(organization);

                User orgAdmin = organization.getUsers().iterator().next();
                orgAdmin.setEnabled(true);
                userRepository.save(orgAdmin);

                log.info("Organization with user successfully created");
            }
            break;
            default: {
                throw new AuthServiceException("Not supported event status: " + status);
            }
        }
    }
}
