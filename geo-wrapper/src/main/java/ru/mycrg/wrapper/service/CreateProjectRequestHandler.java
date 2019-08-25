package ru.mycrg.wrapper.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.geoserver_client.services.IProject;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

/**
 * Сервис обрабатывающий события касательно проектов.
 */
@Service
public class CreateProjectRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateProjectRequestHandler.class);

    private final IProject geoserverClient;
    private final BaseDaoService baseDaoService;
    private final MqSender mqSender;

    public CreateProjectRequestHandler(IProject geoserverClient,
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
            geoserverClient.createProject(payload.getProjectName(), payload.getOrgId());

            baseDaoService.createSchema(DEFAULT_DB_NAME + payload.getOrgId(), payload.getProjectName());

            mqSender.send(new BaseMqProcessResponse(mqRequest, payload.getOrgId(), ProcessStatus.DONE));
        } catch (Exception e) {
            log.error("Не удалось создать проект на геосервере: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}
