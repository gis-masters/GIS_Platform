package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dao.OrganizationSettingsDao;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyRemovingSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.auth_service.service.organization.settings.OrganizationSettingService.ROOT_ORG_ID;

@Service
@Transactional
public class OrgDepRemovingSuccessEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgDepRemovingSuccessEventHandler.class);
    private final OrganizationRepository organizationRepository;
    private final OrganizationSettingsDao organizationSettingsDao;

    public OrgDepRemovingSuccessEventHandler(OrganizationRepository organizationRepository,
                                             OrganizationSettingsDao organizationSettingsDao) {
        this.organizationRepository = organizationRepository;
        this.organizationSettingsDao = organizationSettingsDao;
    }

    @Override
    public String getEventType() {
        return OrganizationDependencyRemovingSucceededEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            final Long orgId = ((OrganizationDependencyRemovingSucceededEvent) mqEvent).getOrgId();

            // Удаляем информацию об организации из настроек системной организации
            organizationSettingsDao.deleteOrgSettingsById(orgId, ROOT_ORG_ID);
            log.debug("Из списка настроек всех организаций, удалили настройки организации {}.", orgId);

            // Удаляем саму организацию
            organizationRepository.deleteById(orgId);

            log.debug("Organization {} successfully deleted with settings cleanup", orgId);
        } catch (Exception e) {
            throw new AuthServiceException("Failed handle OrganizationDependencyRemovingSucceededEvent", e.getCause());
        }
    }
}
