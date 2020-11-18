package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.MqExportProcessRequest;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.ERROR;

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

            String description = "Экспортировано успешно";
            if (payload.getResourceProjections().size() <= 1) {
                description = payload.getResourceProjections().get(0).getTableName();
            }

            String path;
            if ("ESRI Shapefile".equals(payload.getFormat())) {
                path = gdalService.generate(mqRequest);

                mqSender.send(new BaseMqProcessResponse(mqRequest, path, DONE, "SHP " + description, 100));
            } else if ("GML".equals(payload.getFormat())) {
                path = gmlGenerator.generate(mqRequest);

                mqSender.send(new BaseMqProcessResponse(mqRequest, path, DONE, "GML " + description, 100));
            } else {
                final String msg = "Incorrect export format: " + payload.getFormat();
                log.warn(msg);

                mqSender.send(new BaseMqProcessResponse(mqRequest, ERROR, msg));
            }
        } catch (Exception e) {
            log.error("Не удалось выполнить экспорт: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ERROR, e.getMessage()));
        }
    }

}
