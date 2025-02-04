package ru.mycrg.wrapper.queue.handlers;

import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.exceptions.ClientException;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedFailedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.export.GDALService;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;

@Service
public class ImportShapeRequestHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportShapeRequestHandler.class);
    private final IMessageBusProducer messageBus;
    private final GDALService gdalService;

    public ImportShapeRequestHandler(IMessageBusProducer messageBus, GDALService gdalService) {
        this.messageBus = messageBus;
        this.gdalService = gdalService;
    }

    @Override
    public String getEventType() {
        return ShapeLoadedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ShapeLoadedEvent event = (ShapeLoadedEvent) mqEvent;
        log.debug("Start import of geometry shape: {}", event.getProcessId());
        try {
            String tableName = String.format("temporaryTable_%s", RandomStringUtils.random(5, true, true))
                                     .toLowerCase();
            event.setSourceTableName(tableName);
            log.debug("Table name : {}", tableName);
            ErrorReport errorReport = gdalService.importFromShape(event.getFilePath(),
                                                                  event.getDbName(),
                                                                  tableName,
                                                                  event.getSrs());

            messageBus.produce(
                    new ShapeImportedSucceededEvent(event, PENDING,
                                                    "Промежуточная таблица создана",
                                                    50,
                                                    "",
                                                    errorReport));
        } catch (ClientException e) {
            String msg = "Ошибка при импорте геометрии из shape файла: " + e.getMessage();
            log.error(msg);

            messageBus.produce(new ShapeImportedFailedEvent(event, ERROR, e.getMessage(), 0, "", msg, null));
        } catch (Exception e) {
            String msg = "Что то пошло не так при импорте геометрии из shape файла: " + e.getMessage();
            log.error(msg);

            messageBus.produce(new ShapeImportedFailedEvent(event, ERROR, e.getMessage(), 0, "", null, msg));
        }
    }
}
