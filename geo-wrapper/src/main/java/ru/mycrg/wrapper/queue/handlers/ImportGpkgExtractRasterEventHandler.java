package ru.mycrg.wrapper.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTile;
import ru.mycrg.data_service_contract.queue.response.ImportGpkgExtractRasterBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.messagebus_contract.events.integration_wrapper.ImportGpkgExtractRasterEvent;
import ru.mycrg.wrapper.service.export.GDALService;

import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class ImportGpkgExtractRasterEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGpkgExtractRasterEventHandler.class);

    private final IMessageBusProducer messageBus;
    private final GDALService gdalService;

    public ImportGpkgExtractRasterEventHandler(IMessageBusProducer messageBus,
                                               GDALService gdalService) {
        this.messageBus = messageBus;
        this.gdalService = gdalService;
    }

    @Override
    public String getEventType() {
        return ImportGpkgExtractRasterEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ImportGpkgExtractRasterEvent event = (ImportGpkgExtractRasterEvent) mqEvent;
        String businessKey = event.getBusinessKey();

        try {
            Map<String, GpkgTile> importedTiles = gdalService.importRastersFromGeoPackage(event.getFileId(),
                                                                                          event.getDbName(),
                                                                                          event.getToken(),
                                                                                          event.getTilesNames());

            messageBus.produce(
                    new ImportGpkgExtractRasterBackwardEvent(DONE,
                                                             businessKey,
                                                             importedTiles));

            log.debug("GPKG успешно распакован. Поставили обратный ивент в кролика.");
        } catch (Exception e) {
            String msg = "Ошибка при извлечении растров из GPKG файла: " + e.getMessage();
            log.error(msg);

            messageBus.produce(new ImportGpkgExtractRasterBackwardEvent(ERROR, businessKey, msg));
        }
    }
}
