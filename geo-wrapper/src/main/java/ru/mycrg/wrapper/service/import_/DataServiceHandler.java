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
import ru.mycrg.data_service_contract.dto.AdditionalFieldDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.import_.ImportMqResponse;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.dto.import_.MatchingPair;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.ImportException;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

@Service
public class DataServiceHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(DataServiceHandler.class);

    private final OkHttpClient httpClient;
    private final IMessageBusProducer messageBus;
    private final CrgProperties properties;

    public DataServiceHandler(IMessageBusProducer messageBus, CrgProperties properties) {
        this.messageBus = messageBus;
        this.properties = properties;
        this.httpClient = new OkHttpClient();
    }

    public void handle(ImportRequestEvent event, @NotNull ImportMqTask importTask) {
        final String tableName = importTask.getTargetResource().getTableName();
        final String datasetName = importTask.getTargetResource().getSchemaName();

        SchemaDto schemaDto = importTask.getFeatureDescription();
        String tableTitle = schemaDto.getTitle();
        String tableDescription = schemaDto.getDescription();

        log.debug("Add table {} to data-service. To dataset: {} / {} / {}",
                  tableName, datasetName, tableTitle, tableDescription);

        SchemaDto schema = importTask.getFeatureDescription();
        List<MatchingPair> allProperties = importTask.getPairs();
        List<SimplePropertyDto> schemaProperties = schema.getProperties();

        JSONObject json = new JSONObject();
        json.put("name", tableName);
        json.put("title", tableTitle);
        json.put("details", tableDescription);
        json.put("crs", "EPSG:" + importTask.getSrs());
        json.put("schemaId", schemaDto.getName());
        json.put("additionalFields", addAdditionalFields(schemaProperties, allProperties));

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, json.toString());

        URL tableUrl = getTableUrl(datasetName);

        log.info("URL: {} / TEST TABLE BODY: {}", tableUrl, json);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + importTask.getUserToken())
                .url(tableUrl)
                .post(body).build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new ImportException(response.message());
            }

            if (nextImporter != null) {
                nextImporter.handle(event, importTask);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось создать таблицу: %s Reason: %s",
                                       importTask.getTargetResource().getTableName(), e.getMessage());
            log.error(msg);

            messageBus.produce(
                    new ImportResponseEvent(event, TASK_ERROR, "", msg, new ImportMqResponse(importTask)));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }

    @NotNull
    private URL getTableUrl(String datasetName) {
        try {
            return new URL(properties.getDataServiceUrl(), "/datasets/" + datasetName + "/tables");
        } catch (Exception e) {
            throw new ImportException("Failed build url to datasets", e.getCause());
        }
    }

    private List<AdditionalFieldDto> addAdditionalFields(List<SimplePropertyDto> schemaProperties,
                                                         List<MatchingPair> allProperties) {
        List<AdditionalFieldDto> additionalFields = new ArrayList<>();

        for (MatchingPair matchingPair: allProperties) {
            String name = matchingPair.getTarget().getName();
            long count = schemaProperties.stream()
                                         .filter(property -> property.getName().equalsIgnoreCase(name))
                                         .count();
            if (count < 1) {
                AdditionalFieldDto additionalField = new AdditionalFieldDto(name, matchingPair.getTarget().getType());
                additionalFields.add(additionalField);
            }
        }

        return additionalFields;
    }
}
