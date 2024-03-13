package ru.mycrg.wrapper.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.SchemaDto;
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
 * Сервис обрабатывающий события экспорта.
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
        return ExportRequestEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ExportRequestEvent event = (ExportRequestEvent) mqEvent;
        try {
            ExportProcessModel payload = event.getPayload();
            if (payload.getResourceProjections().isEmpty()) {
                log.debug("Не найдено ресурсов для экспорта. {}", payload);
                messageBus.produce(
                        new ExportResponseEvent(event, ERROR, "Завершено", "Не найдено ресурсов для экспорта"));

                return;
            }

            log.debug("Try handle export event: {}", payload);
            String pathToZip;
            if ("ESRI Shapefile".equals(payload.getFormat())) {
                pathToZip = gdalService.generate(event);

                messageBus.produce(
                        new ExportResponseEvent(event, DONE, getDescription(payload, "SHP"), 100, pathToZip));
            } else if ("GML".equals(payload.getFormat())) {
                pathToZip = gmlGenerator.generate(event);

                messageBus.produce(
                        new ExportResponseEvent(event, DONE, getDescription(payload, "GML"), 100, pathToZip));
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
        if (payload.getResourceProjections().isEmpty()) {
            return String.format("Из %s экспортировано 0 слоёв", fileType);
        } else if (payload.getResourceProjections().size() == 1) {
            SchemaDto schema = payload.getResourceProjections().get(0).getSchema();
            if (schema != null) {
                return String.format("Из %s экспортирован 1 слой: %s", fileType, schema.getTitle());
            }
        } else {
            return String.format("Из %s экспортировано: %d слоя(ёв)",
                                 fileType, payload.getResourceProjections().size());
        }

        return fileType;
    }
}
