package ru.mycrg.wrapper.service.import_;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.CrgChainable;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import java.util.List;

import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.ERROR;

/**
 * <p>Сервис обрабатывающий событие импорта.</p>
 *
 * Формирует/инициирует последовательность действий необходимых для импорта:
 * <ul>
 *     <li>Копирование данных из чернового источника</li>
 *     <li>Постобработка данных</li>
 *     <li>Создание хранилища если нужно</li>
 *     <li>Создание фичи на геосервере</li>
 *     <li>Присоединение стиля к слою</li>
 *     <li>Очистка данных чернового импорта.<br>
 *         В случае, если импорт не удался, очистка не выполняется, чтобы можно было проанализировать ситауцию<br>
 *         Не очищаем слои на геосервере в рабочей области "scratch_" потому как туда доступ только у админа
*      </li>
 * </ul>
 */
@Service
public class ImportRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportRequestHandler.class);

    private final MqSender mqSender;
    private final CrgChainable<ImportMqTask> initialImportService;

    public ImportRequestHandler(InitialImportService initialImporter,
                                GisServiceLayerHandler gisServiceLayerHandler,
                                PostImportService postImporter,
                                GeoserverFeatureTypeHandler featureTypeHandler,
                                GeoserverStorageHandler storageHandler,
                                GeoserverStyleHandler styleHandler,
                                ScratchImportCleaner importCleaner,
                                MqSender mqSender) {
        this.mqSender = mqSender;
        this.initialImportService = initialImporter;

        // Задаем цепочку отбработчиков
        this.initialImportService.setHandlers(gisServiceLayerHandler, null);
        gisServiceLayerHandler.setHandlers(postImporter, initialImportService);
        postImporter.setHandlers(storageHandler, gisServiceLayerHandler);
        storageHandler.setHandlers(featureTypeHandler, postImporter);
        featureTypeHandler.setHandlers(styleHandler, storageHandler);
        styleHandler.setHandlers(importCleaner, featureTypeHandler);
        importCleaner.setHandlers(null, styleHandler);
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

    private List<ImportMqTask> getTasks(@NotNull BaseMqProcessRequest mqRequest) {
        return mapper.convertValue(mqRequest.getPayload(), new TypeReference<List<ImportMqTask>>() {});
    }
}
