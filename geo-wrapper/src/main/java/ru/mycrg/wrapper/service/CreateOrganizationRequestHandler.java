package ru.mycrg.wrapper.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.geoserver_client.IGeoserverClientFacade;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

/**
 * Сервис обрабатывающий события касательно организации. <br>
 */
@Service
public class CreateOrganizationRequestHandler implements IRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateOrganizationRequestHandler.class);

    private final IGeoserverClientFacade geoserverClient;
    private final BaseDaoService baseDaoService;
    private final MqSender mqSender;

    private ObjectMapper mapper = new ObjectMapper();

    public CreateOrganizationRequestHandler(IGeoserverClientFacade geoserverClient,
                                            BaseDaoService baseDaoService,
                                            MqSender mqSender) {
        this.geoserverClient = geoserverClient;
        this.baseDaoService = baseDaoService;
        this.mqSender = mqSender;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            OrgMqProcessRequest payload = mapper.convertValue(mqRequest.getPayload(), OrgMqProcessRequest.class);

            geoserverClient.createOrganization(payload);

            baseDaoService.createDb(DEFAULT_DB_NAME + payload.getOrgId());

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.DONE));
        } catch (Exception e) {
            log.error("Не удалось создать организацию на геосервере: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}
