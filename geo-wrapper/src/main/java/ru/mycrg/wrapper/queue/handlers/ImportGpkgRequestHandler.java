package ru.mycrg.wrapper.queue.handlers;

import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.exceptions.ClientException;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.queue.request.GpkgStartLoaderEvent;
import ru.mycrg.data_service_contract.queue.response.GpkgImportedFailedEvent;
import ru.mycrg.data_service_contract.queue.response.GpkgImportedSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.export.GDALService;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;

@Service
public class ImportGpkgRequestHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGpkgRequestHandler.class);
    private final IMessageBusProducer messageBus;
    private final GDALService gdalService;

    public ImportGpkgRequestHandler(IMessageBusProducer messageBus, GDALService gdalService) {
        this.messageBus = messageBus;
        this.gdalService = gdalService;
    }

    @Override
    public String getEventType() {
        return GpkgStartLoaderEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final GpkgStartLoaderEvent event = (GpkgStartLoaderEvent) mqEvent;
        log.debug("Start import of geometry GPKG: {}", event.getProcessId());

        try {
            // Генерируем уникальное имя схемы для каждого процесса импорта
            String schemaName = String.format("gpkg_schema_%d_%s",
                                              event.getProcessId(),
                                              RandomStringUtils.random(5, true, true)).toLowerCase();

            event.setGdalCreatedSchema(schemaName);
            log.debug("Уникальная schema в базе для импорта gpkg: {}", schemaName);

            // Импортируем GeoPackage в созданную схему
            ErrorReport errorReport = gdalService.importFromGeoPackageToSchema(event.getFilePath(),
                                                                               event.getDbName(),
                                                                               schemaName);

            messageBus.produce(
                    new GpkgImportedSucceededEvent(event, TASK_DONE,
                                                   "Промежуточные таблицы созданы в схеме " + schemaName,
                                                   50,
                                                   "GPKG",
                                                   errorReport));
        } catch (ClientException e) {
            String msg = "Ошибка при импорте геометрии из GPKG файла: " + e.getMessage();
            log.error(msg);

            messageBus.produce(new GpkgImportedFailedEvent(event, ERROR, e.getMessage(), 0, "GPKG", msg, null));
        } catch (Exception e) {
            String msg = "Что то пошло не так при импорте геометрии из GPKG файла: " + e.getMessage();
            log.error(msg);

            messageBus.produce(new GpkgImportedFailedEvent(event, ERROR, e.getMessage(), 0, "GPKG", null, msg));
        }
    }
}
