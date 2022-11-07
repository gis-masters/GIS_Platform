package ru.mycrg.wrapper.queue.handlers;

import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.export.GDALService;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;

@Service
public class ImportGeometryShapeRequestHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGeometryShapeRequestHandler.class);
    private final IMessageBusProducer messageBus;
    private final GDALService gdalService;

    public ImportGeometryShapeRequestHandler(IMessageBusProducer messageBus, GDALService gdalService) {
        this.messageBus = messageBus;
        this.gdalService = gdalService;
    }

    @Override
    public String getEventType() {
        return "ShapeLoadedEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ShapeLoadedEvent event = (ShapeLoadedEvent) mqEvent;
        try {
            String tableName = String.format("temporaryTable_%s", RandomStringUtils.random(5, true, true));
            log.debug("Start import of geometry shape: {}", event.getProcessId());
            event.setSourceTableName(tableName);

            gdalService.importGeometryFromShape(event.getFilePath(), event.getDbName(), tableName, event.getSrs());

            messageBus.produce(new ShapeImportedEvent(event, PENDING, "Промежуточная таблица создана",
                                                      50, ""));
        } catch (Exception e) {
            log.error("Ошибка при импорте геометрии из shape файла: {}", e.getMessage());
            messageBus.produce(new ShapeImportedEvent(event, ERROR, e.getMessage(), 0, ""));
        }
    }
}
