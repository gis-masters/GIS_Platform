package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyProvisionSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;

import javax.persistence.EntityNotFoundException;

import static ru.mycrg.auth_service.service.OrganizationStatus.PROVISIONED;

@Service
@Transactional
public class OrgDepProvisionSuccessEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgDepProvisionSuccessEventHandler.class);

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public OrgDepProvisionSuccessEventHandler(UserRepository userRepository,
                                              OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    @Override
    public String getEventType() {
        return "OrganizationDependencyProvisionSucceededEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            final Long orgId = ((OrganizationDependencyProvisionSucceededEvent) mqEvent).getOrgId();

            organizationRepository
                    .findById(orgId)
                    .ifPresentOrElse(organization -> {
                        organization.setStatus(PROVISIONED.toString());
                        organizationRepository.save(organization);

                        User orgAdmin = organization.getUsers().iterator().next();
                        orgAdmin.setEnabled(true);
                        userRepository.save(orgAdmin);

                        log.info("Organization with user successfully created");
                    }, () -> {
                        throw new EntityNotFoundException("Not found org by id: " + orgId);
                    });
        } catch (Exception e) {
            throw new AuthServiceException("Failed handle OrganizationDependencyProvisionSucceededEvent", e.getCause());
        }
    }
}
