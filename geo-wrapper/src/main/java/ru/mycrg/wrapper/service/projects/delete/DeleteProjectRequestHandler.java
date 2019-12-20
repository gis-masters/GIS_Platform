package ru.mycrg.wrapper.service.projects.delete;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.projects.ProjectService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.OrgMqProcessRequest;
import ru.mycrg.mq_queue_contract.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.CrgDaoSchemaService;
import ru.mycrg.wrapper.dao.ICrgDaoSchema;
import ru.mycrg.geoserver_client.services.projects.IProject;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

/**
 * Сервис обрабатывающий события удаления проектов.
 */
@Service
public class DeleteProjectRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private final Logger log = LoggerFactory.getLogger(DeleteProjectRequestHandler.class);

    private final MqSender mqSender;
    private final IProject geoserverClient;
    private final ICrgDaoSchema daoSchemaService;

    public DeleteProjectRequestHandler(CrgDaoSchemaService daoSchemaService,
                                       MqSender mqSender) {
        this.mqSender = mqSender;
        this.geoserverClient = new ProjectService();
        this.daoSchemaService = daoSchemaService;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            log.debug("Start delete project process: {}", mqRequest.getId());

            OrgMqProcessRequest request = mapper.convertValue(mqRequest.getPayload(), OrgMqProcessRequest.class);

            geoserverClient.deleteProject(request.getProjectName());
            daoSchemaService.delete(DEFAULT_DB_NAME + request.getOrgId(), request.getProjectName());

            mqSender.send(new BaseMqProcessResponse(mqRequest, request.getOrgId(), ProcessStatus.DONE));
        } catch (Exception e) {
            log.error("Не удалось удалить проект на геосервере: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}
