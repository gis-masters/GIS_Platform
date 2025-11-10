package ru.mycrg.wrapper.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.BuildGpkgBackwardEvent;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.export.GpkgGenerator;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

/**
 * Сервис обрабатывающий события экспорта.
 */
@Service
public class ExportGpkgRequestHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ExportGpkgRequestHandler.class);

    private final IMessageBusProducer messageBus;
    private final GpkgGenerator gpkgGenerator;

    public ExportGpkgRequestHandler(IMessageBusProducer messageBus,
                                    GpkgGenerator gpkgGenerator) {
        this.messageBus = messageBus;
        this.gpkgGenerator = gpkgGenerator;
    }

    @Override
    public String getEventType() {
        return BuildGpkgEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final BuildGpkgEvent event = (BuildGpkgEvent) mqEvent;
        try {
            ExportProcessModel payload = event.getPayload();
            if (payload.getResourceProjections().isEmpty()) {
                log.debug("Не найдено ресурсов для экспорта. {}", payload);
                messageBus.produce(new BuildGpkgBackwardEvent(event, ERROR, "Не найдено ресурсов для экспорта!"));

                return;
            }

            log.debug("Пытаемся выгрузить GPKG: {}", payload);
            String pathToGpkg = gpkgGenerator.generate(event);

            messageBus.produce(
                    new BuildGpkgBackwardEvent(event, DONE, getDescription(payload), 100, pathToGpkg));
        } catch (Exception e) {
            log.error("Не удалось выполнить экспорт: ", e);

            messageBus.produce(new BuildGpkgBackwardEvent(event, ERROR, e.getMessage()));
        }
    }

    @NotNull
    private String getDescription(ExportProcessModel payload) {
        if (payload.getResourceProjections().isEmpty()) {
            return String.format("Из %s экспортировано 0 слоёв", "GPKG");
        } else if (payload.getResourceProjections().size() == 1) {
            SchemaDto schema = payload.getResourceProjections().get(0).getSchema();
            if (schema != null) {
                return String.format("Из %s экспортирован 1 слой: %s", "GPKG", schema.getTitle());
            }
        } else {
            return String.format("Из %s экспортировано: %d слоя(ёв)",
                                 "GPKG", payload.getResourceProjections().size());
        }

        return "GPKG";
    }
}
