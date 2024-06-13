package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyProvisionSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import javax.persistence.EntityNotFoundException;

import static java.time.LocalDateTime.now;
import static ru.mycrg.auth_service.service.organization.OrganizationStatus.PROVISIONED;

@Service
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
        return OrganizationDependencyProvisionSucceededEvent.class.getSimpleName();
    }

    @Override
    @Transactional
    public void handle(IMessageBusEvent mqEvent) {
        try {
            Long orgId = ((OrganizationDependencyProvisionSucceededEvent) mqEvent).getOrgId();

            organizationRepository
                    .findById(orgId)
                    .ifPresentOrElse(organization -> {
                        organization.setStatus(PROVISIONED.toString());
                        organization.setLastModified(now());
                        organizationRepository.save(organization);

                        User owner = organization.getUsers().iterator().next();
                        owner.setEnabled(true);
                        owner.setLastModified(now());
                        userRepository.save(owner);

                        log.info("Организация: '{}' с владельцем: '{}' успешно создана", orgId,
                                 owner.getName());
                    }, () -> {
                        throw new EntityNotFoundException("Не найдена организация по id: " + orgId);
                    });
        } catch (Exception e) {
            throw new AuthServiceException("Не удалось обработать OrganizationDependencyProvisionSucceededEvent",
                                           e.getCause());
        }
    }
}
