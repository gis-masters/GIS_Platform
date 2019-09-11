package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.wrapper.queue.MqSender;

import static ru.mycrg.common.CrgConstants.DEFAULT_STORE_POSTFIX;
import static ru.mycrg.common.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.common.enums.ProcessStatus.TASK_ERROR;

@Service
public class GeoserverImportService extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GeoserverImportService.class);

    private final MqSender mqSender;
    private final FeatureTypeService featureTypesService;

    public GeoserverImportService(MqSender mqSender,
                                  FeatureTypeService featureTypesService) {
        this.mqSender = mqSender;
        this.featureTypesService = featureTypesService;
    }

    public void handle(BaseMqProcessRequest mqRequest, ImportMqTask importTask) {
        log.debug("Publish feature on geoserver");

        try {
            featureTypesService.create(
                    importTask.getTargetResource().getSchemaName(),
                    importTask.getTargetResource().getDbName() + DEFAULT_STORE_POSTFIX,
                    importTask.getFeatureDescription().getName(),
                    importTask.getUserToken());

            log.debug("Import chain successful end");
            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_DONE, "Готово", -1));

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (GeoserverClientException e) {
            String msg = "Не удалось опубликовать слой на геосервере: " + importTask.getFeatureDescription().getName();
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
