package ru.mycrg.wrapper.service.organization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionSucceededEvent;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.geoserver_client.services.organization.IOrganization;
import ru.mycrg.geoserver_client.services.organization.OrganizationService;
import ru.mycrg.wrapper.dao.CrgDaoDatabaseService;
import ru.mycrg.wrapper.dao.ICrgDaoDatabase;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.requests_handler.IOrganizationRequestHandler;

import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

/**
 * Сервис обрабатывающий событие создания организации.
 */
@Service
public class CreateOrganizationHandler implements IOrganizationRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateOrganizationHandler.class);

    private final ICrgDaoDatabase crgDatabase;
    private final MqSender mqSender;
    private final IOrganization organizationService;

    public CreateOrganizationHandler(CrgDaoDatabaseService crgDatabase,
                                     MqSender mqSender) {
        this.crgDatabase = crgDatabase;
        this.mqSender = mqSender;

        organizationService = new OrganizationService();
    }

    @Override
    public void handle(IOrganizationEvent event) {
        try {
            OrganizationInitializedEvent mqEvent = (OrganizationInitializedEvent) event;

            organizationService.create(mqEvent);

            crgDatabase.createDb(DEFAULT_DB_NAME + mqEvent.getOrgId());

            mqSender.sendOrgEvent(new OrganizationDependencyProvisionSucceededEvent(mqEvent));
        } catch (Exception e) {
            log.error("Не удалось создать организацию на геосервере: ", e);

            mqSender.sendOrgEvent(new OrganizationDependencyProvisionFailedEvent(event));
        }
    }

}
