package ru.mycrg.wrapper.service.import_;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.geoserver_client.services.feature_types.IFeatureTypes;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import java.util.List;

import static ru.mycrg.common.CrgConstants.DEFAULT_STORE_POSTFIX;
import static ru.mycrg.common.enums.ProcessStatus.*;

@Service
public class ImportRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportRequestHandler.class);

    private final IFeatureTypes featureTypesService;
    private final MqSender mqSender;
    private final ImportService importService;

    public ImportRequestHandler(ImportService importService, MqSender mqSender,
                                IFeatureTypes featureTypesService) {
        this.featureTypesService = featureTypesService;
        this.importService = importService;
        this.mqSender = mqSender;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            log.debug("Start import: {}", mqRequest.getId());

            getTasks(mqRequest)
                    .forEach(task -> handleTask(task, mqRequest));

            mqSender.send(new BaseMqProcessResponse(mqRequest, DONE, "Импорт завершен", 100));
        } catch (Exception e) {
            log.error("Ошибка при импорте: {}", e.getMessage());
            mqSender.send(new BaseMqProcessResponse(mqRequest, ERROR, e.getMessage()));
        }
    }

    // TODO: заюзать паттерн САГА для обеспечения согласованности данных между сервисами
    // TODO: подчищать черновой импорт, как в БД так и на геосервере
    private void handleTask(ImportMqTask mqTask, BaseMqProcessRequest mqRequest) {
        try {
            importService.doImport(mqTask);
            importService.postHandle(mqTask);

            featureTypesService.create(
                    mqTask.getTargetResource().getSchemaName(),
                    mqTask.getTargetResource().getDbName() + DEFAULT_STORE_POSTFIX,
                    mqTask.getFeatureDescription().getName(),
                    mqTask.getUserToken());

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(mqTask), TASK_DONE, "Success", 0));
        } catch (Exception e) {
            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(mqTask), TASK_ERROR, "Error", e.getMessage()));
        }

    }

    private List<ImportMqTask> getTasks(BaseMqProcessRequest mqRequest) {
        return mapper.convertValue(mqRequest.getPayload(), new TypeReference<List<ImportMqTask>>() {});
    }
}
