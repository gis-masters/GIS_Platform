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
 * <p>
 * Формирует/инициирует последовательность действий необходимых для импорта:
 * <ul>
 *     <li>Копирование данных из чернового источника</li>
 *     <li>Постобработка данных</li>
 *     <li>Запрос к gis-service на создание слоя</li>
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

    public ImportRequestHandler(DataServiceHandler dataServiceHandler,
                                GeometryHandler geometryHandler,
                                CopyDataService copyDataService,
                                GisServiceLayerHandler gisServiceLayerHandler,
                                PostImportService postImporter,
                                ScratchImportCleaner importCleaner,
                                IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
        this.initialImportService = dataServiceHandler;

        // Задаем цепочку обработчиков
        this.initialImportService.setHandlers(copyDataService, null);
        copyDataService.setHandlers(geometryHandler, initialImportService);
        geometryHandler.setHandlers(gisServiceLayerHandler, copyDataService);
        gisServiceLayerHandler.setHandlers(postImporter, geometryHandler);
        postImporter.setHandlers(importCleaner, gisServiceLayerHandler);
        importCleaner.setHandlers(null, postImporter);
    }

    @Override
    public String getEventType() {
        return ImportRequestEvent.class.getSimpleName();
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
