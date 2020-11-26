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
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class DataServiceHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(DataServiceHandler.class);

    private final OkHttpClient httpClient;
    private final MqSender mqSender;
    private final CrgProperties properties;

    public DataServiceHandler(MqSender mqSender, CrgProperties properties) {
        this.mqSender = mqSender;
        this.properties = properties;
        this.httpClient = new OkHttpClient();
    }

    public void handle(BaseMqProcessRequest mqRequest, @NotNull ImportMqTask importTask) {
        final String tableName = importTask.getTargetResource().getTableName();
        final String datasetName = importTask.getTargetResource().getSchemaName();

        SchemaDto schemaDto = importTask.getFeatureDescription();
        String tableTitle = schemaDto.getTitle();
        String tableDescription = schemaDto.getDescription();

        log.debug("Add table {} to data-service. To dataset: {} / {} / {}",
                  tableName, datasetName, tableTitle, tableDescription);

        JSONObject json = new JSONObject();
        json.put("name", tableName);
        json.put("title", tableTitle);
        json.put("details", tableDescription);

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, json.toString());

        URL datasetUrl = getDatasetUrl(datasetName);

        log.info("URL: {} / TEST TABLE BODY: {}", datasetUrl, json);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + importTask.getUserToken())
                .url(datasetUrl)
                .post(body).build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new ImportException(response.body().string());
            }

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось создать таблицу: %s Reason: %s",
                                       importTask.getTargetResource().getTableName(), e.getMessage());
            log.error(msg);

            mqSender.send(new BaseMqProcessResponse(mqRequest, new ImportMqResponse(importTask), TASK_ERROR, "", msg));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }

    @NotNull
    private URL getDatasetUrl(String datasetName) {
        try {
            return new URL(properties.getDataServiceUrl(), "/datasets/" + datasetName + "/tables");
        } catch (Exception e) {
            throw new ImportException("Failed build url to datasets", e.getCause());
        }
    }
}
