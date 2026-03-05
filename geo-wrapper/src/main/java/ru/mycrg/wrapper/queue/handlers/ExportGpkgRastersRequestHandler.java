package ru.mycrg.wrapper.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.data_service_contract.dto.BuildGpkgRastersBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgRastersEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.service.export.GpkgGenerator;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.COMPLETED;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

/**
 * Сервис обрабатывает эксопрт растров в GPKG
 */
@Service
public class ExportGpkgRastersRequestHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ExportGpkgRastersRequestHandler.class);

    private final IMessageBusProducer messageBus;
    private final GpkgGenerator gpkgGenerator;

    public ExportGpkgRastersRequestHandler(IMessageBusProducer messageBus,
                                           GpkgGenerator gpkgGenerator) {
        this.messageBus = messageBus;
        this.gpkgGenerator = gpkgGenerator;
    }

    @Override
    public String getEventType() {
        return BuildGpkgRastersEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final BuildGpkgRastersEvent event = (BuildGpkgRastersEvent) mqEvent;

        try {
            Map<String, String> resource = event.getResourceAndPath();
            if (resource.isEmpty()) {
                String msg = "Не найдено ресурсов для экспорта растров в GPKG!";
                log.debug(msg);
                messageBus.produce(new BuildGpkgRastersBackwardEvent(event, ERROR, msg));

                return;
            }

            List<GpkgTile> report = gpkgGenerator.generate(event);

            if (event.getPath() == null || event.getPath().isEmpty()) {
                Optional<GpkgTile> tile = report.stream()
                                                .filter(t -> t.getStatus() == COMPLETED)
                                                .findAny();

                tile.ifPresent(gpkgTile -> event.setPath(gpkgTile.getPathAfterImport()));
            }

            messageBus.produce(new BuildGpkgRastersBackwardEvent(event, DONE, report));
        } catch (Exception e) {
            log.error("Не удалось выполнить экспорт: ", e);

            messageBus.produce(new BuildGpkgRastersBackwardEvent(event, ERROR, e.getMessage()));
        }
    }
}
