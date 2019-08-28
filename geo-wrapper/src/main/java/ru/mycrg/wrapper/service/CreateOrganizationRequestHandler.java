package ru.mycrg.wrapper.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.CrgDatabaseService;
import ru.mycrg.wrapper.dao.ICrgDatabase;
import ru.mycrg.wrapper.geoserver_client.services.organization.IOrganization;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

/**
 * Сервис обрабатывающий событие создания организации.
 */
@Service
public class CreateOrganizationRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateOrganizationRequestHandler.class);

    private final IOrganization organizationService;
    private final ICrgDatabase crgDatabase;
    private final MqSender mqSender;

    public CreateOrganizationRequestHandler(IOrganization organizationService,
                                            CrgDatabaseService crgDatabase,
                                            MqSender mqSender) {
        this.organizationService = organizationService;
        this.crgDatabase = crgDatabase;
        this.mqSender = mqSender;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            OrgMqProcessRequest payload = mapper.convertValue(mqRequest.getPayload(), OrgMqProcessRequest.class);

            organizationService.create(payload);

            crgDatabase.createDb(DEFAULT_DB_NAME + payload.getOrgId());

            mqSender.send(new BaseMqProcessResponse(mqRequest, payload.getOrgId(), ProcessStatus.DONE));
        } catch (Exception e) {
            log.error("Не удалось создать организацию на геосервере: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}
