package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.queue.IResponseHandler;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.IAuthServiceEvent;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionSucceededEvent;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import static ru.mycrg.auth_service.service.OrganizationStatus.PROVISIONED;

@Service
@Transactional
public class OrgDepProvisionSuccessEventHandler implements IResponseHandler {

    private static final Logger log = LoggerFactory.getLogger(OrgDepProvisionSuccessEventHandler.class);

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public OrgDepProvisionSuccessEventHandler(UserRepository userRepository,
                                              OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    public void handle(IAuthServiceEvent mqEvent) {
        final IOrganizationEvent event = (OrganizationDependencyProvisionSucceededEvent) mqEvent;

        organizationRepository
                .findById(event.getOrgId())
                .ifPresentOrElse(organization -> {
                    organization.setStatus(PROVISIONED.toString());
                    organizationRepository.save(organization);

                    User orgAdmin = organization.getUsers().iterator().next();
                    orgAdmin.setEnabled(true);
                    userRepository.save(orgAdmin);

                    log.info("Organization with user successfully created");
                }, () -> {
                    throw new EntityNotFoundException("Not found org by id: " + event.getOrgId());
                });
    }
}
