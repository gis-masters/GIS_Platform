package ru.mycrg.wrapper.service.import_;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.import_.ImportMqResponse;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class GeoserverFeatureTypeHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GeoserverFeatureTypeHandler.class);

    private final IMessageBusProducer messageBus;

    public GeoserverFeatureTypeHandler(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    public void handle(ImportRequestEvent event, @NotNull ImportMqTask importTask) {
        try {
            final String layerName = importTask.getLayerName();
            final String dataStoreName = importTask.getTargetResource().getSchemaName();
            final String workspaceName = importTask.getWorkspaceName();

            log.debug("Publish feature: {} on geoserver workspace: {} Datastore: {}",
                      layerName, workspaceName, dataStoreName);

            final ResponseModel<Object> responseModel = new FeatureTypeService(importTask.getRootToken())
                    .create(workspaceName, dataStoreName, layerName, importTask.getSrs());
            if (!responseModel.isSuccessful()) {
                if (responseModel.getBody() != null) {
                    logAndInitRollback(event, importTask, responseModel.getBody().toString());
                } else {
                    logAndInitRollback(event, importTask, responseModel.getMsg());
                }
            } else {
                if (nextImporter != null) {
                    nextImporter.handle(event, importTask);
                }
            }
        } catch (HttpClientException e) {
            logAndInitRollback(event, importTask, e.getMessage());
        }
    }

    private void logAndInitRollback(ImportRequestEvent event, ImportMqTask importTask, String msg) {
        log.error("Не удалось опубликовать слой {} на геосервере. Reason: {}", importTask.getLayerName(), msg);

        messageBus.produce(
                new ImportResponseEvent(event, TASK_ERROR, "", msg, new ImportMqResponse(importTask)));

        if (previousImporter != null) {
            previousImporter.rollback(importTask);
        }
    }
}
