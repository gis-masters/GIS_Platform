package ru.mycrg.wrapper.service.projects.create;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.projects.CrgChainable;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

/**
 * Сервис обрабатывающий события касательно проектов.
 */
@Service
public class CreateProjectRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateProjectRequestHandler.class);

    private final MqSender mqSender;
    private final CrgChainable<OrgMqProcessRequest> geoserverClientWrapper;
    private final CrgChainable<OrgMqProcessRequest> daoWrapper;

    public CreateProjectRequestHandler(GeoserverClientWrapper geoserverClientWrapper,
                                       DaoWrapper daoWrapper,
                                       MqSender mqSender) {
        this.geoserverClientWrapper = geoserverClientWrapper;
        this.daoWrapper = daoWrapper;
        this.mqSender = mqSender;

        // Задаем цепочку отбработчиков
        this.geoserverClientWrapper.setHandlers(this.daoWrapper, null);
        this.daoWrapper.setHandlers(null, this.geoserverClientWrapper);
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            log.debug("Start create project process: {}", mqRequest.getId());

            OrgMqProcessRequest payload = mapper.convertValue(mqRequest.getPayload(), OrgMqProcessRequest.class);

            geoserverClientWrapper.handle(mqRequest, payload);
        } catch (Exception e) {
            log.error("Не удалось создать проект на геосервере: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}
