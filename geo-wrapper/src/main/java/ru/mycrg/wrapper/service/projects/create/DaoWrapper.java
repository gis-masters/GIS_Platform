package ru.mycrg.wrapper.service.projects.create;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.OrgMqProcessRequest;
import ru.mycrg.mq_queue_contract.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.CrgDaoSchemaService;
import ru.mycrg.wrapper.dao.ICrgDaoSchema;
import ru.mycrg.wrapper.exceptions.DaoException;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.CrgChainable;

import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

@Service
public class DaoWrapper implements CrgChainable<OrgMqProcessRequest> {

    private final Logger log = LoggerFactory.getLogger(DaoWrapper.class);

    private CrgChainable<OrgMqProcessRequest> previousHandler;
    private CrgChainable<OrgMqProcessRequest> nextHandler;

    private final MqSender mqSender;
    private final ICrgDaoSchema daoSchemaService;

    public DaoWrapper(CrgDaoSchemaService daoSchemaService,
                      MqSender mqSender) {
        this.mqSender = mqSender;
        this.daoSchemaService = daoSchemaService;
    }

    @Override
    public void setHandlers(CrgChainable nextHandler, CrgChainable previousHandler) {
        this.nextHandler = nextHandler;
        this.previousHandler = previousHandler;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest, OrgMqProcessRequest request) {
        try {
            log.debug("Start last stage. {}", request.getProjectName());

            daoSchemaService.create(DEFAULT_DB_NAME + request.getOrgId(), request.getProjectName());

            mqSender.send(new BaseMqProcessResponse(mqRequest, request.getOrgId(), ProcessStatus.DONE));
        } catch (DaoException e) {
            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));

            previousHandler.rollback(request);
        }
    }

    @Override
    public void rollback(OrgMqProcessRequest request) {
        previousHandler.rollback(request);
    }
}
