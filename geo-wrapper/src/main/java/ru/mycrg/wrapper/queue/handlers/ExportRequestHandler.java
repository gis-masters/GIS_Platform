package ru.mycrg.wrapper.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ExportResponseEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.export.GDALService;
import ru.mycrg.wrapper.service.export.GmlGenerator;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

/**
 * Сервис обрабатывающий события експорта.
 */
@Service
public class ExportRequestHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ExportRequestHandler.class);

    private final IMessageBusProducer messageBus;
    private final GDALService gdalService;
    private final GmlGenerator gmlGenerator;

    public ExportRequestHandler(IMessageBusProducer messageBus, GDALService gdalService, GmlGenerator gmlGenerator) {
        this.messageBus = messageBus;
        this.gdalService = gdalService;
        this.gmlGenerator = gmlGenerator;
    }

    @Override
    public String getEventType() {
        return "ExportRequestEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ExportRequestEvent event = (ExportRequestEvent) mqEvent;
        try {
            ExportProcessModel payload = event.getPayload();

            String path;
            if ("ESRI Shapefile".equals(payload.getFormat())) {
                path = gdalService.generate(event);

                messageBus.produce(new ExportResponseEvent(event, DONE, getDescription(payload, "SHP"), 100, path));
            } else if ("GML".equals(payload.getFormat())) {
                path = gmlGenerator.generate(event);

                messageBus.produce(new ExportResponseEvent(event, DONE, getDescription(payload, "GML"), 100, path));
            } else {
                final String msg = "Incorrect export format: " + payload.getFormat();
                log.warn(msg);

                messageBus.produce(new ExportResponseEvent(event, ERROR, "", msg));
            }
        } catch (Exception e) {
            log.error("Не удалось выполнить экспорт: ", e);

            messageBus.produce(new ExportResponseEvent(event, ERROR, "", e.getMessage()));
        }
    }

    @NotNull
    private String getDescription(ExportProcessModel payload, String fileType) {
        String description = fileType;
        if (payload.getResourceProjections().size() <= 1) {
            description = description + " " + payload.getResourceProjections().get(0).getSchema().getTitle();
        } else {
            description = description + " Экспортировано: " + payload.getResourceProjections().size() + " слоя(ёв)";
        }

        return description;
    }
}
