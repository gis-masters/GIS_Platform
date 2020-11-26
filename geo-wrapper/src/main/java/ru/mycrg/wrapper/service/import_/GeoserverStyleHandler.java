package ru.mycrg.wrapper.service.import_;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.queue.MqSender;

import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class GeoserverStyleHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GeoserverStyleHandler.class);

    private final MqSender mqSender;

    public GeoserverStyleHandler(MqSender mqSender) {
        this.mqSender = mqSender;
    }

    public void handle(BaseMqProcessRequest mqRequest, @NotNull ImportMqTask importTask) {
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

            mqSender.send(new BaseMqProcessResponse(mqRequest,
                                                    new ImportMqResponse(importTask), TASK_DONE, "Готово", -1));

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (Exception e) {
            String msg = "Не удалось прикрепить стиль к слою: " + layerName;
            log.error(msg, e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, new ImportMqResponse(importTask), TASK_ERROR, "", msg));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }
}
