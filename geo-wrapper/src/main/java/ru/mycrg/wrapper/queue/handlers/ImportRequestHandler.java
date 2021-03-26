package ru.mycrg.wrapper.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.CrgChainable;
import ru.mycrg.wrapper.service.import_.*;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

/**
 * <p>Сервис обрабатывающий событие импорта.</p>
 *
 * Формирует/инициирует последовательность действий необходимых для импорта:
 * <ul>
 *     <li>Копирование данных из чернового источника</li>
 *     <li>Постобработка данных</li>
 *     <li>Создание фичи на геосервере</li>
 *     <li>Присоединение стиля к слою</li>
 *     <li>Запрос к data-service на создание таблицы</li>
 *     <li>Очистка данных чернового импорта.<br>
 *         В случае, если импорт не удался, очистка не выполняется, чтобы можно было проанализировать ситауцию<br>
*      </li>
 * </ul>
 */
@Service
public class ImportRequestHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportRequestHandler.class);

    private final IMessageBusProducer messageBus;
    private final CrgChainable<ImportMqTask> initialImportService;

    public ImportRequestHandler(InitialImportService initialImporter,
                                GeometryHandler geometryHandler,
                                DataServiceHandler dataServiceHandler,
                                GisServiceLayerHandler gisServiceLayerHandler,
                                PostImportService postImporter,
                                GeoserverFeatureTypeHandler featureTypeHandler,
                                GeoserverStyleHandler styleHandler,
                                ScratchImportCleaner importCleaner,
                                IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
        this.initialImportService = initialImporter;

        // Задаем цепочку отбработчиков
        this.initialImportService.setHandlers(geometryHandler, null);
        geometryHandler.setHandlers(dataServiceHandler, initialImportService);
        dataServiceHandler.setHandlers(gisServiceLayerHandler, geometryHandler);
        gisServiceLayerHandler.setHandlers(postImporter, dataServiceHandler);
        postImporter.setHandlers(featureTypeHandler, gisServiceLayerHandler);
        featureTypeHandler.setHandlers(styleHandler, postImporter);
        styleHandler.setHandlers(importCleaner, featureTypeHandler);
        importCleaner.setHandlers(null, styleHandler);
    }

    @Override
    public String getEventType() {
        return "ImportRequestEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ImportRequestEvent event = (ImportRequestEvent) mqEvent;
        try {
            log.debug("Start import: {}", event.getProcessId());

            event.getTasks().forEach(task -> initialImportService.handle(event, task));

            messageBus.produce(new ImportResponseEvent(event, DONE, "Импорт завершен", 100));
        } catch (Exception e) {
            log.error("Ошибка при импорте: {}", e.getMessage());
            messageBus.produce(new ImportResponseEvent(event, ERROR, "", e.getMessage()));
        }
    }
}
