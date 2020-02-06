package ru.mycrg.wrapper.service.import_;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.storage.DataStores;
import ru.mycrg.geoserver_client.services.storage.StorageService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.queue.MqSender;

import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_STORE_POSTFIX;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class GeoserverStorageHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GeoserverStorageHandler.class);

    private final MqSender mqSender;
    private final StorageService storageService;

    public GeoserverStorageHandler(MqSender mqSender) {
        this.mqSender = mqSender;
        this.storageService = new StorageService();
    }

    public void handle(BaseMqProcessRequest mqRequest, @NotNull ImportMqTask importTask) {
        log.debug("Check and create if need storage on geoserver");

        SchemaDto featureDescription = null;
        try {
            featureDescription = importTask.getFeatureDescription();

            ResourceProjection targetResource = importTask.getTargetResource();

            String databaseName = targetResource.getDbName();
            String projectName = targetResource.getSchemaName();
            String storeName = databaseName + DEFAULT_STORE_POSTFIX;

            DataStores dataStores = storageService.getStores(projectName);
            if (dataStores.getDataStore().isEmpty() && isStoreNotExist(dataStores, projectName)) {
                log.debug("Create storage: {}", storeName);

                storageService.createStorage(databaseName, projectName, projectName, storeName);
            }

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (GeoserverClientException e) {
            String msg = "Не удалось проверить/создать хранилище на геосервере: " + featureDescription.getName();
            log.error(msg, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_ERROR, "", msg));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }

    private boolean isStoreNotExist(DataStores dataStores, String projectName) {
        return dataStores
                .getDataStore().stream()
                .noneMatch(store -> store.getName().equals(projectName));
    }

}
