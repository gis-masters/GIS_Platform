package ru.mycrg.wrapper.service.import_;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.CrgChainable;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import java.util.List;

import static ru.mycrg.common.enums.ProcessStatus.DONE;
import static ru.mycrg.common.enums.ProcessStatus.ERROR;

@Service
public class ImportRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportRequestHandler.class);

    private final MqSender mqSender;
    private final CrgChainable<ImportMqTask> initialImportService;
    private final CrgChainable<ImportMqTask> postImportService;
    private final CrgChainable<ImportMqTask> geoserverImportService;

    public ImportRequestHandler(InitialImportService initialImporter,
                                PostImportService postImporter,
                                GeoserverImportService geoserverImporter,
                                MqSender mqSender) {
        this.mqSender = mqSender;
        this.initialImportService = initialImporter;
        this.postImportService = postImporter;
        this.geoserverImportService = geoserverImporter;

        // TODO: подчищать черновой импорт, как в БД так и на геосервере
        // Задаем цепочку отбработчиков
        this.initialImportService.setHandlers(postImportService, null);
        this.postImportService.setHandlers(geoserverImportService, this.initialImportService);
        this.geoserverImportService.setHandlers(null, postImportService);
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            log.debug("Start import: {}", mqRequest.getId());

            getTasks(mqRequest)
                    .forEach(task -> initialImportService.handle(mqRequest, task));

            mqSender.send(new BaseMqProcessResponse(mqRequest, DONE, "Импорт завершен", 100));
        } catch (Exception e) {
            log.error("Ошибка при импорте: {}", e.getMessage());
            mqSender.send(new BaseMqProcessResponse(mqRequest, ERROR, e.getMessage()));
        }
    }

    private List<ImportMqTask> getTasks(BaseMqProcessRequest mqRequest) {
        return mapper.convertValue(mqRequest.getPayload(), new TypeReference<List<ImportMqTask>>() {});
    }
}
