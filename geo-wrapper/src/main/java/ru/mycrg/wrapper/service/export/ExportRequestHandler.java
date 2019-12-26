package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.MqExportProcessRequest;
import ru.mycrg.mq_queue_contract.enums.ProcessStatus;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

/**
 * Сервис обрабатывающий события експорта.
 */
@Service
public class ExportRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private final Logger log = LoggerFactory.getLogger(ExportRequestHandler.class);

    private final MqSender mqSender;
    private final GDALService gdalService;
    private final GmlGenerator gmlGenerator;

    public ExportRequestHandler(MqSender mqSender, GDALService gdalService, GmlGenerator gmlGenerator) {
        this.mqSender = mqSender;
        this.gdalService = gdalService;
        this.gmlGenerator = gmlGenerator;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            MqExportProcessRequest payload = mapper.convertValue(mqRequest.getPayload(), MqExportProcessRequest.class);

            String path;
            if (payload.getFormat() != null) {
                path = gdalService.generate(mqRequest);

                SchemaDto featureDescription = payload.getFgistpRules().get(0);

                mqSender.send(new BaseMqProcessResponse(mqRequest, path, ProcessStatus.DONE,
                        featureDescription.getTitle(), 100));
            } else {
                path = gmlGenerator.generate(mqRequest);

                mqSender.send(new BaseMqProcessResponse(mqRequest, path, ProcessStatus.DONE));
            }
        } catch (Exception e) {
            log.error("Не удалось выполнить экспорт: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}
