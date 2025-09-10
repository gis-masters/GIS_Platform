package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.queue.request.GpkgStartLoaderEvent;
import ru.mycrg.data_service_contract.queue.response.GpkgImportedFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static java.util.Objects.nonNull;

@Service
public class ImportGpkgFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGpkgFailedEventHandler.class);

    private final ProcessService processService;

    public ImportGpkgFailedEventHandler(ProcessService processService) {
        this.processService = processService;
    }

    @Override
    public String getEventType() {
        return GpkgImportedFailedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        GpkgImportedFailedEvent event = (GpkgImportedFailedEvent) mqEvent;
        GpkgStartLoaderEvent requestEvent = event.getImportShapeEvent();

        log.debug("In GpkgStartLoaderEvent! {}", requestEvent);

        String error = nonNull(event.getWarningMessage()) ? event.getWarningMessage() : event.getErrorMessage();
        log.error("Выполнение импорта из geoPackage потерпело неудачу. Причина: {}", error);

        processService.error(requestEvent.getDbName(),
                             requestEvent.getProcessId(),
                             JsonConverter.toJsonNode(event));
    }
}
