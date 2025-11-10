package ru.mycrg.wrapper.queue.handlers;

import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.exceptions.ClientException;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExtractGpkgEvent;
import ru.mycrg.data_service_contract.queue.response.ExtractGpkgBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.export.GDALService;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class ExtractGpkgEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ExtractGpkgEventHandler.class);
    private final IMessageBusProducer messageBus;
    private final GDALService gdalService;

    public ExtractGpkgEventHandler(IMessageBusProducer messageBus, GDALService gdalService) {
        this.messageBus = messageBus;
        this.gdalService = gdalService;
    }

    @Override
    public String getEventType() {
        return ExtractGpkgEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ExtractGpkgEvent event = (ExtractGpkgEvent) mqEvent;
        String businessKey = event.getBusinessKey();

        String schemaName = String.format("gpkg_schema_%s",
                                          RandomStringUtils.random(15, true, true)).toLowerCase();

        try {
            ErrorReport errorReport = gdalService.importFromGeoPackageToSchema(event.getFilePath(),
                                                                               event.getDbName(),
                                                                               schemaName);

            messageBus.produce(
                    new ExtractGpkgBackwardEvent(DONE,
                                                 businessKey,
                                                 schemaName,
                                                 errorReport));

            log.debug("GPKG успешно распакован. Поставили обратный ивент в кролика.");
        } catch (ClientException e) {
            String msg = "Ошибка при импорте геометрии из GPKG файла: " + e.getMessage();
            log.error(msg);

            messageBus.produce(new ExtractGpkgBackwardEvent(ERROR,
                                                            businessKey,
                                                            schemaName,
                                                            msg));
        } catch (Exception e) {
            String msg = "Что то пошло не так при импорте геометрии из GPKG файла: " + e.getMessage();
            log.error(msg);

            messageBus.produce(new ExtractGpkgBackwardEvent(ERROR,
                                                            businessKey,
                                                            schemaName,
                                                            msg));
        }
    }
}
