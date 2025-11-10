package ru.mycrg.data_service.queue.handlers.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.gpkg.export.GpkgAddInfoService;
import ru.mycrg.data_service_contract.queue.request.AppendGpkgInfoEvent;
import ru.mycrg.data_service_contract.queue.response.AppendGpkgBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class AppendGpkgInfoHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(AppendGpkgInfoHandler.class);
    private final IMessageBusProducer messageBus;
    private final GpkgAddInfoService gpkgAddInfoService;

    public AppendGpkgInfoHandler(IMessageBusProducer messageBus, GpkgAddInfoService gpkgAddInfoService) {
        this.messageBus = messageBus;
        this.gpkgAddInfoService = gpkgAddInfoService;
    }

    @Override
    public String getEventType() {
        return AppendGpkgInfoEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        AppendGpkgInfoEvent event = (AppendGpkgInfoEvent) mqEvent;

        String pathToFile = event.getPathToGpkg();
        log.debug("Пытаемся добавить информацию к файлу по пути: ({})", pathToFile);

        try {
            gpkgAddInfoService.appendAllExistData(pathToFile,
                                                  event.getDbName(),
                                                  event.getGpkgAppendingData());

            log.debug("Успешно добавили информацию в файл: ({})", pathToFile);

            messageBus.produce(new AppendGpkgBackwardEvent(event.getBusinessKey(), DONE));
        } catch (Exception e) {
            log.error("При добавлении информации к файлу: ({}). Ошибка: {}", pathToFile, e.getMessage());
            messageBus.produce(new AppendGpkgBackwardEvent(event.getBusinessKey(), ERROR, e));
        }
    }
}
