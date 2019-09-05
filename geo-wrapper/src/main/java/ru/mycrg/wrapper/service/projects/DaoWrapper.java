package ru.mycrg.wrapper.service.projects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.CrgDaoSchemaService;
import ru.mycrg.wrapper.dao.ICrgDaoSchema;
import ru.mycrg.wrapper.exceptions.CrgDaoException;
import ru.mycrg.wrapper.queue.MqSender;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

@Service
public class DaoWrapper implements CrgProjectChain {

    private final Logger log = LoggerFactory.getLogger(DaoWrapper.class);

    private CrgProjectChain previousHandler;
    private CrgProjectChain nextHandler;

    private final MqSender mqSender;
    private final ICrgDaoSchema daoSchemaService;

    public DaoWrapper(CrgDaoSchemaService daoSchemaService,
                      MqSender mqSender) {
        this.mqSender = mqSender;
        this.daoSchemaService = daoSchemaService;
    }

    @Override
    public void setHandlers(CrgProjectChain nextHandler, CrgProjectChain previousHandler) {
        this.nextHandler = nextHandler;
        this.previousHandler = previousHandler;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest, OrgMqProcessRequest request) {
        try {
            log.debug("Start last stage. {}", request.getProjectName());

            daoSchemaService.create(DEFAULT_DB_NAME + request.getOrgId(), request.getProjectName());

            mqSender.send(new BaseMqProcessResponse(mqRequest, request.getOrgId(), ProcessStatus.DONE));
        } catch (CrgDaoException e) {
            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));

            previousHandler.rollback(request);
        }
    }

    @Override
    public void rollback(OrgMqProcessRequest request) {
        previousHandler.rollback(request);
    }
}
