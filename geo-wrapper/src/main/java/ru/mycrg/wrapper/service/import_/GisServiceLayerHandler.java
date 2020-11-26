package ru.mycrg.wrapper.service.import_;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.ImportException;
import ru.mycrg.wrapper.queue.MqSender;

import java.net.URL;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_STORE_POSTFIX;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class GisServiceLayerHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GisServiceLayerHandler.class);

    private final JSONObject json = new JSONObject();

    private final MqSender mqSender;
    protected final OkHttpClient httpClient;
    private final CrgProperties properties;

    public GisServiceLayerHandler(MqSender mqSender, CrgProperties properties) {
        this.mqSender = mqSender;
        this.properties = properties;
        this.httpClient = new OkHttpClient();
    }

    public void handle(BaseMqProcessRequest mqRequest, @NotNull ImportMqTask importTask) {
        SchemaDto schemaDto = importTask.getFeatureDescription();
        String layerName = importTask.getLayerName();
        String styleName = importTask.getStyleName();
        String title = schemaDto.getTitle() == null ? layerName: schemaDto.getTitle();
        String schemaId = schemaDto.getName();

        log.debug("Add layer {} to crg-gis-service", layerName);

        String databaseName = importTask.getTargetResource().getDbName();
        String datasetName = importTask.getTargetResource().getSchemaName();
        String storeName = databaseName + DEFAULT_STORE_POSTFIX;

        json.put("title", title);
        json.put("dataset", datasetName);
        json.put("internalName", layerName);
        json.put("schemaId", schemaId);
        json.put("dataStoreName", storeName);
        json.put("nativeCRS", "EPSG:" + importTask.getSrs());
        json.put("type", "vector");
        json.put("styleName", styleName);

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, json.toString());

        Request createLayer = new Request.Builder()
                .addHeader("Authorization", "Bearer " + importTask.getRootToken())
                .url(getLayersUrl(importTask))
                .post(body)
                .build();

        try (Response response = httpClient.newCall(createLayer).execute()) {
            if (!response.isSuccessful()) {
                throw new ImportException(response.body().string());
            }

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (Exception e) {
            String msg = "Не удалось создать слой на gis_service: " + layerName;
            log.error(msg, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                                              new ImportMqResponse(importTask), TASK_ERROR, "", msg));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }

    @NotNull
    private URL getLayersUrl(@NotNull ImportMqTask importTask) {
        try {
            return new URL(properties.getGisServiceUrl(), "/projects/" + importTask.getProjectId() + "/layers");
        } catch (Exception e) {
            throw new ImportException("Failed build url to layers", e.getCause());
        }
    }
}
