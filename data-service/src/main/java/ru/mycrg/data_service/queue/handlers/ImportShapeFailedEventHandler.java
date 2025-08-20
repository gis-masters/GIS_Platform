package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static java.util.Objects.nonNull;

@Service
public class ImportShapeFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportShapeFailedEventHandler.class);

    private final ProcessService processService;

    public ImportShapeFailedEventHandler(ProcessService processService) {
        this.processService = processService;
    }

    @Override
    public String getEventType() {
        return ShapeImportedFailedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ShapeImportedFailedEvent event = (ShapeImportedFailedEvent) mqEvent;
        ShapeLoadedEvent requestEvent = event.getImportShapeEvent();

        log.debug("In ShapeImportedFailedEvent! {}", requestEvent);

        String error = nonNull(event.getWarningMessage()) ? event.getWarningMessage() : event.getErrorMessage();
        log.error("Выполнение импорта геометрии потерпело неудачу. Причина: {}", error);

        processService.error(requestEvent.getDbName(),
                             requestEvent.getProcessId(),
                             JsonConverter.toJsonNode(event));
    }
}
