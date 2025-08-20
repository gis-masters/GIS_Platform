package ru.mycrg.data_service.service.gisogd;

import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.IntegrationConfig;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static ru.mycrg.data_service.config.CrgCommonConfig.*;
import static ru.mycrg.data_service_contract.enums.ValueType.DATETIME;

@Service
public class GisogdRfIntegrator {

    private final Logger log = LoggerFactory.getLogger(GisogdRfIntegrator.class);

    private final URL gisogdUrl;
    private final URL gisogdTokenUrl;
    private final String clientId;
    private final String clientSecret;

    private final HttpClient httpClient;
    private final RecordsDao recordsDao;
    private final DocumentLibraryService librariesService;
    private final IntegrationConfig integrationConfig;

    public GisogdRfIntegrator(Environment environment,
                              RecordsDao recordsDao,
                              DocumentLibraryService librariesService,
                              IntegrationConfig integrationConfig) throws MalformedURLException {
        this.gisogdUrl = new URL(environment.getRequiredProperty("crg-options.integration.gisogd-rf"));
        this.gisogdTokenUrl = new URL(environment.getRequiredProperty("crg-options.integration.gisogd-rf-token"));
        this.clientId = environment.getRequiredProperty("crg-options.integration.gisogd-rf-client-id");
        this.clientSecret = environment.getRequiredProperty("crg-options.integration.gisogd-rf-client-secret");

        this.recordsDao = recordsDao;
        this.librariesService = librariesService;
        this.integrationConfig = integrationConfig;

        this.httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
    }

    public String getTokenGisogdRF() {
        try {
            MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded");

            RequestBody body = RequestBody.create(mediaType, "grant_type=client_credentials");

            Request request = new Request.Builder()
                    .url(gisogdTokenUrl)
                    .addHeader("Content-Type", "application/x-www-form-urlencoded")
                    .header("Authorization", Credentials.basic(clientId, clientSecret))
                    .post(body)
                    .build();

            ResponseModel<Object> responseModel = httpClient.handleRequest(request);
            if (!responseModel.isSuccessful()) {
                String msg = String.format("Не удалось получить токен. Тело ответа: %s", responseModel.getBody());
                log.error(msg);

                throw new DataServiceException(msg);
            }

            Map<String, Object> response = (Map<String, Object>) responseModel.getBody();
            if (!response.containsKey("access_token")) {
                String msg = "Поле access_token отсутствует в ответе.";
                log.error(msg);

                throw new DataServiceException(msg);
            }

            return response.get("access_token").toString();
        } catch (Exception e) {
            String msg = String.format("Не удалось получить токен в ГИСОГД РФ. Причина: %s", e.getMessage());
            log.error(msg, e);

            throw new DataServiceException(msg);
        }
    }

    public void send(String token, ResourceQualifier lQualifier, String contentTypeId) {
        String pathIdentifier = contentTypeId.isEmpty()
                ? lQualifier.toString()
                : format("%s.%s", lQualifier, contentTypeId);

        Map<String, String> pathMap = integrationConfig.gisogdRfPathMapper();
        if (pathMap.containsKey(pathIdentifier)) {
            getRecordsByContentType(lQualifier, contentTypeId)
                    .forEach(record -> sendRecord(token, pathMap.get(pathIdentifier),
                                                  JsonConverter.toJsonNode(record.getContent()).toString()));
        } else {
            String message = format("Не удалось найти подходящий путь для %s.", pathIdentifier);
            log.warn(message);

            throw new DataServiceException(message);
        }
    }

    private List<IRecord> getRecordsByContentType(ResourceQualifier lQualifier, String contentTypeId) {
        SchemaDto schema = librariesService.getSchema(lQualifier.getTable());

        List<SimplePropertyDto> properties = schema.getProperties();

        return convertToAnotherDateFormat(
                recordsDao.findAllForDataSection3(lQualifier, schema, contentTypeId), properties);
    }

    private List<IRecord> convertToAnotherDateFormat(List<IRecord> records, List<SimplePropertyDto> properties) {
        if (records.isEmpty()) {
            return records;
        }

        List<SimplePropertyDto> propsWithDatetime = properties
                .stream()
                .filter(property -> DATETIME.equals(property.getValueTypeAsEnum()))
                .collect(Collectors.toList());

        if (propsWithDatetime.isEmpty()) {
            return records;
        } else {
            List<IRecord> convertRecords = new ArrayList<>(records);
            convertRecords.forEach(record -> {
                Map<String, Object> recordProps = record.getContent();
                propsWithDatetime
                        .stream()
                        .filter(property -> recordProps.containsKey(property.getName()))
                        .forEach(dateProperty -> {
                            Object value = recordProps.get(dateProperty.getName());
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN);
                            LocalDateTime dateTime = LocalDateTime.parse(value.toString(), formatter);
                            Instant dateInstant = dateTime.toInstant(ZoneOffset.UTC);
                            recordProps.put(dateProperty.getName(), dateInstant);
                        });
            });

            return convertRecords;
        }
    }

    private void sendRecord(String token, String path, String content) {
        try {
            RequestBody body = RequestBody.create(DEFAULT_MEDIA_TYPE, content);
            Request request = new Request.Builder()
                    .url(format("%s/%s", gisogdUrl, path))
                    .post(body)
                    .addHeader("Authorization", format("Bearer %s", token))
                    .addHeader("Content-Type", DEFAULT_CONTENT_TYPE)
                    .build();

            ResponseModel<Object> response = httpClient.handleRequest(request);
            if (!response.isSuccessful()) {
                String message = format("Не удалось отправить данные в ГИСОГД РФ. Причина: %s. Запись: %s",
                                        response.getBody(), content);

                log.warn(message);
            }
        } catch (Exception e) {
            String message = format("Не удалось отправить данные в ГИСОГД РФ. Причина: %s. Запись: %s",
                                    e.getMessage(), content);

            log.warn(message);
        }
    }
}
