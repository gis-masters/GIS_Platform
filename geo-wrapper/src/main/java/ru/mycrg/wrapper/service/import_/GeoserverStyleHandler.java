package ru.mycrg.wrapper.service.import_;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.import_.ImportMqResponse;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class GeoserverStyleHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GeoserverStyleHandler.class);

    private final IMessageBusProducer messageBus;

    public GeoserverStyleHandler(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    public void handle(ImportRequestEvent event, @NotNull ImportMqTask importTask) {
        final String layerName = importTask.getLayerName();
        final String styleName = importTask.getStyleName();
        final String workspaceName = importTask.getWorkspaceName();

        log.debug("Add style: {} to layer: {}", styleName, layerName);
        try {
            ResponseModel<Object> response = new StyleService(importTask.getRootToken())
                    .associate(workspaceName + ":" + layerName, styleName);
            if (!response.isSuccessful()) {
                log.warn("Style not associated: {}", response);
            }

            messageBus.produce(
                    new ImportResponseEvent(event, TASK_DONE, "Готово", -1, new ImportMqResponse(importTask)));

            if (nextImporter != null) {
                nextImporter.handle(event, importTask);
            }
        } catch (Exception e) {
            String msg = "Не удалось прикрепить стиль к слою: " + layerName;
            log.error(msg, e);

            messageBus.produce(
                    new ImportResponseEvent(event, TASK_ERROR, "", msg, new ImportMqResponse(importTask)));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }
}
