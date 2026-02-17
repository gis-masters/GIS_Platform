package ru.mycrg.data_service_client;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.data_service_client.dto.SimplifiedFeatureResponse;
import ru.mycrg.data_service_client.mappers.SimplifiedFeatureMapper;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static ru.mycrg.http_client.JsonConverter.toJson;

public class DataServiceClient implements IDataServiceClient {

    private final Logger log = LoggerFactory.getLogger(DataServiceClient.class);

    private final HttpClient httpClient;
    private final URL baseUrl;

    public DataServiceClient(URL baseUrl, HttpClient httpClient) {
        this.baseUrl = baseUrl;
        this.httpClient = httpClient;
    }

    @Override
    public List<FileResponse> postFiles(String accessToken, RequestBody body) throws HttpClientException {
        List<FileResponse> createdFiles = new ArrayList<>();

        String fileUrl = baseUrl + "/files";

        Request request = new Request.Builder()
                .url(fileUrl)
                .method("POST", body)
                .addHeader("Authorization", "Bearer " + accessToken)
                .build();

        log.debug("Запрос создания файла на {}", fileUrl);
        ResponseModel<List<FileResponse>> response = httpClient.handleRequest(request,
                                                                              new TypeReference<>() {
                                                                              });
        log.debug("Код ответа: {}. Тело ответа: {}", response.getCode(), response.getBody());

        if (response.isSuccessful()) {
            createdFiles.addAll(response.getBody());
        }

        return createdFiles;
    }

    @Override
    public Page<Feature> getFeaturesWithCustomParams(String token,
                                                     String dataset,
                                                     String table,
                                                     String filter,
                                                     int page,
                                                     int size) throws HttpClientException {
        log.debug("Параметры передаваемые в запросе: filter={}, page={}, size={}", filter, page, size);

        String baseUrlPath = baseUrl.toString() + "/datasets/" + dataset + "/tables/" + table + "/records";

        StringBuilder urlBuilder = new StringBuilder(baseUrlPath);
        urlBuilder.append("?page=").append(page);
        urlBuilder.append("&size=").append(size);

        if (filter != null && !filter.isEmpty()) {
            urlBuilder.append("&filter=").append(filter);
        }

        String url = urlBuilder.toString();

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("Authorization", "Bearer " + token)
                .build();

        log.debug("Запрос получения фичей по фильтру: {}", url);

        ResponseModel<RestResponsePage<SimplifiedFeatureResponse>> response = httpClient.handleRequest(request,
                                                                                                       new TypeReference<>() {
                                                                                                       });

        log.debug("Ответ от data-service: код={}, isSuccessful={}", response.getCode(), response.isSuccessful());
        log.debug("Тело ответа (response.getBody()): {}", response.getBody());

        if (!response.isSuccessful()) {
            log.error("Ошибка при получении features. Код: {}, Тело: {}",
                      response.getCode(), response.getBody());

            throw new HttpClientException("Не удалось получить features: " + response.getCode());
        }

        RestResponsePage<SimplifiedFeatureResponse> pageResult = response.getBody();
        if (pageResult == null) {
            log.error("pageResult is NULL! response.getBody() вернул null при коде 200");

            throw new HttpClientException("Получен null в теле ответа при коде 200");
        }

        List<SimplifiedFeatureResponse> simplifiedContent = pageResult.getContent();

        List<Feature> features = SimplifiedFeatureMapper.toFeatures(simplifiedContent);

        return new PageImpl<>(
                features,
                pageResult.getPageable(),
                pageResult.getTotalElements()
        );
    }

    @Override
    public ResponseModel<Map<String, Object>> getLibRecordById(String token, String docLibId, Long recId) throws HttpClientException {
        String url = baseUrl + "/document-libraries/" + docLibId + "/records/" + recId;

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("Authorization", "Bearer " + token)
                .build();

        log.debug("Запрос получения записи библиотеки по ID: {}", url);

        return httpClient.handleRequest(request,
                                       new TypeReference<>() {
                                       });
    }

    @Override
    public ResponseModel<Object> patchRecordInTableById(String token,
                                                        String dataset,
                                                        String table,
                                                        Feature feature) throws HttpClientException {
        String url = baseUrl.toString() + "/datasets/" + dataset + "/tables/" + table + "/records/" + feature.getId();

        RequestBody requestBody = RequestBody.create(
                okhttp3.MediaType.parse("application/merge-patch+json"),
                toJson(feature)
        );

        Request request = new Request.Builder()
                .url(url)
                .method("PATCH", requestBody)
                .addHeader("Authorization", "Bearer " + token)
                .addHeader("Content-Type", "application/merge-patch+json")
                .build();

        log.debug("Запрос обновления записи в таблице по ID: {}", url);
        log.debug("Фича для запроса: {}", feature);

        return httpClient.handleRequest(request,
                                        new TypeReference<>() {
                                        });
    }

    @Override
    public ResponseModel<Object> patchLibRecordField(String token,
                                                     String docLibId,
                                                     Long recId,
                                                     String fieldName,
                                                     Object fieldValue) throws HttpClientException {
        String url = baseUrl + "/document-libraries/" + docLibId + "/records/" + recId;

        Map<String, Object> payload = Map.of(fieldName, fieldValue);

        RequestBody requestBody = RequestBody.create(
                okhttp3.MediaType.parse("application/merge-patch+json"),
                toJson(payload)
        );

        Request request = new Request.Builder()
                .url(url)
                .method("PATCH", requestBody)
                .addHeader("Authorization", "Bearer " + token)
                .addHeader("Content-Type", "application/merge-patch+json")
                .build();

        log.debug("Запрос обновления поля записи библиотеки: {}", url);
        log.debug("Поле: {}, Значение: {}", fieldName, fieldValue);

        return httpClient.handleRequest(request,
                                       new TypeReference<>() {
                                       });
    }

    @Override
    public ResponseModel<FileResponse> getFileById(String token, String uuid) throws HttpClientException {
        String url = baseUrl + "/files/" + uuid;

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("Authorization", "Bearer " + token)
                .build();

        log.debug("Запрос получения файла по ID: {}", url);

        return httpClient.handleRequest(request,
                                       new TypeReference<>() {
                                       });
    }
}
