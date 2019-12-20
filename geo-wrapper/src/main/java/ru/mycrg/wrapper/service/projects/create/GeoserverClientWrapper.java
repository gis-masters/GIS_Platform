package ru.mycrg.wrapper.service.projects.create;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.projects.ProjectService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.OrgMqProcessRequest;
import ru.mycrg.mq_queue_contract.enums.ProcessStatus;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.projects.IProject;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.CrgChainable;

@Service
public class GeoserverClientWrapper implements CrgChainable<OrgMqProcessRequest> {

    private final Logger log = LoggerFactory.getLogger(GeoserverClientWrapper.class);

    private CrgChainable<OrgMqProcessRequest> previousHandler;
    private CrgChainable<OrgMqProcessRequest> nextHandler;

    private final MqSender mqSender;
    private final IProject geoserverClient;

    public GeoserverClientWrapper(MqSender mqSender) {
        this.mqSender = mqSender;
        this.geoserverClient = new ProjectService();
    }

    @Override
    public void setHandlers(CrgChainable<OrgMqProcessRequest> nextHandler,
                            CrgChainable<OrgMqProcessRequest> previousHandler) {
        this.nextHandler = nextHandler;
        this.previousHandler = previousHandler;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest, OrgMqProcessRequest request) {
        try {
            log.debug("Start first stage. {}", request.getProjectName());

            geoserverClient.createProject(request.getProjectName(), request.getOrgId());

            nextHandler.handle(mqRequest, request);
        } catch (GeoserverClientException e) {
            String msg = String.format("Не удалось создать проект на геосервере: %s", request.getProjectName());

            log.error(msg, e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, msg));
        }
    }

    @Override
    public void rollback(OrgMqProcessRequest request) {
        try {
            log.warn("Do rollback of project creation: {}", request.getProjectName());

            geoserverClient.deleteProject(request.getProjectName());
        } catch (GeoserverClientException e) {
            log.error("Не удалось откатить создание проекта: {} / {}", request.getProjectName(), e.getMessage());
        }
    }
}
