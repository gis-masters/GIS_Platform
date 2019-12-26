package ru.mycrg.wrapper.service.import_;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.geoserver_client.services.feature_types.IFeatureTypes;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.queue.MqSender;

import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_STORE_POSTFIX;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class GeoserverImportService extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GeoserverImportService.class);

    private final MqSender mqSender;
    private final IFeatureTypes featureTypesService;
    private final StyleService styleService;

    public GeoserverImportService(MqSender mqSender) {
        this.mqSender = mqSender;
        this.styleService = new StyleService();
        this.featureTypesService = new FeatureTypeService();
    }

    public void handle(BaseMqProcessRequest mqRequest, @NotNull ImportMqTask importTask) {
        log.debug("Publish feature on geoserver");

        SchemaDto featureDescription = null;
        try {
            featureDescription = importTask.getFeatureDescription();

            featureTypesService.delete(
                    importTask.getTargetResource().getSchemaName(),
                    importTask.getTargetResource().getDbName() + DEFAULT_STORE_POSTFIX,
                    featureDescription.getName(),
                    importTask.getUserToken());

            featureTypesService.create(
                    importTask.getTargetResource().getSchemaName(),
                    importTask.getTargetResource().getDbName() + DEFAULT_STORE_POSTFIX,
                    featureDescription.getName(),
                    importTask.getUserToken(),
                    importTask.getSrs());

            try {
                styleService.associate(
                        importTask.getTargetResource().getSchemaName() + ":" + featureDescription.getName(),
                        featureDescription.getName());
            } catch (GeoserverClientException e) {
                log.error("Не удалось прикрепить стиль к слою: {}", e.getMessage());
            }

            log.debug("Import chain successful end");
            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_DONE, "Готово", -1));

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (GeoserverClientException e) {
            String msg = "Не удалось опубликовать слой на геосервере: " + featureDescription.getName();
            log.error(msg, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_ERROR, "", msg));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }

}
