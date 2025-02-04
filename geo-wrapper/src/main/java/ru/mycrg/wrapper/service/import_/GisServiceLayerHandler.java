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
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.ImportMqResponse;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.ImportException;

import java.net.URL;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

@Service
public class GisServiceLayerHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GisServiceLayerHandler.class);

    private final JSONObject json = new JSONObject();

    private final IMessageBusProducer messageBus;
    protected final OkHttpClient httpClient;
    private final CrgProperties properties;

    public GisServiceLayerHandler(IMessageBusProducer messageBus, CrgProperties properties) {
        this.messageBus = messageBus;
        this.properties = properties;
        this.httpClient = new OkHttpClient();
    }

    public void handle(ImportRequestEvent event, @NotNull ImportMqTask importTask) {
        SchemaDto schemaDto = importTask.getFeatureDescription();
        String layerName = importTask.getLayerName();
        String styleName = importTask.getStyleName();
        String workspaceName = importTask.getWorkspaceName();
        String title = schemaDto.getTitle() == null ? layerName : schemaDto.getTitle();
        String schemaId = schemaDto.getName();

        log.debug("Add layer {} to crg-gis-service", layerName);

        String datasetName = importTask.getTargetResource().getSchemaName();

        json.put("title", title);
        json.put("dataset", datasetName);
        json.put("tableName", layerName);
        json.put("schemaId", schemaId);
        json.put("dataStoreName", workspaceName);
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
                nextImporter.handle(event, importTask);
            }
        } catch (Exception e) {
            String msg = "Не удалось создать слой на gis_service: " + layerName;
            log.error(msg, e);

            messageBus.produce(
                    new ImportResponseEvent(event, TASK_ERROR, "", msg, new ImportMqResponse(importTask)));

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
