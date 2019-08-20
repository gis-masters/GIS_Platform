package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import static ru.mycrg.common.enums.ProcessStatus.*;

@Service
public class ImportRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportRequestHandler.class);

    private final MqSender mqSender;
    private final ImportService importService;

    public ImportRequestHandler(ImportService importService, MqSender mqSender) {
        this.importService = importService;
        this.mqSender = mqSender;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        log.debug("Start import");

        try {
            ImportMqRequest payload = mapper.convertValue(mqRequest.getPayload(), ImportMqRequest.class);

            // totalRows = (int) importService.calculateTotalRows(payload.getImportFeatures());
            mqSender.send(new BaseMqProcessResponse(mqRequest, PENDING, "Инициализация", 0));

            payload.getImportFeatures()
                   .forEach(feature -> {
                       importService.doImport(feature, mqRequest);
                       importService.handleTarget(feature, mqRequest);

                       mqSender.send(
                               new BaseMqProcessResponse(mqRequest,
                               new ImportMqResponse(feature), SUB_DONE, "Success", 0));
                   });

            mqSender.send(new BaseMqProcessResponse(mqRequest, DONE, "Импорт завершен", 100));
        } catch (Exception e) {
            log.error("Ошибка при импорте: {}", e.getMessage());
            mqSender.send(new BaseMqProcessResponse(mqRequest, ERROR, e.getMessage()));
        }

    }
}
