package ru.mycrg.integration_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.data_service_client.IDataServiceClient;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DataServiceSpeaker {

    private static final Logger log = LoggerFactory.getLogger(DataServiceSpeaker.class);

    private final IDataServiceClient dataServiceClient;

    public DataServiceSpeaker(IDataServiceClient dataServiceClient) {
        this.dataServiceClient = dataServiceClient;
    }

    public List<Feature> getAllFeaturesWithCustomFilter(String token,
                                                        String dataset,
                                                        String table,
                                                        String filter) throws HttpClientException {
        log.debug("getAllFeaturesWithCustomFilter вызван с filter={}", filter);
        List<Feature> features = new ArrayList<>();
        int currentPage = 0;
        int pageSize = 20;
        Page<Feature> page;

        do {
            log.debug("Запрашиваем страницу {} с размером {}", currentPage, pageSize);
            page = dataServiceClient.getFeaturesWithCustomParams(token, dataset, table, filter, currentPage, pageSize);

            if (page == null) {
                log.warn("Получена null страница на итерации {}", currentPage);
                break;
            } else {
                log.debug("Страница {} содержит {} элементов", currentPage, page.getContent().size());
            }

            features.addAll(page.getContent());
            currentPage++;
        } while (!page.isLast());

        log.debug("Всего собрано features: {}", features.size());

        return features;
    }

    public ResponseModel<Object> patchCurrentFeature(String token,
                                                     String dataset,
                                                     String table,
                                                     Map<String, List<FileDescription>> fileDataProps,
                                                     Long id) throws HttpClientException {
        Map<String, Object> properties = JsonConverter.convertValue(
                fileDataProps,
                new TypeReference<>() {
                }
        );

        Feature feature = new Feature(properties);
        feature.setId(id);

        return dataServiceClient.patchRecordInTableById(token, dataset, table, feature);
    }

    public Map<String, Object> getLibRecordById(String token, String docLibId, Long recId) throws HttpClientException {
        ResponseModel<Map<String, Object>> response = dataServiceClient.getLibRecordById(token, docLibId, recId);

        if (!response.isSuccessful()) {
            log.warn("Не удалось получить запись библиотеки. Код: {}, docLibId: {}, recId: {}",
                     response.getCode(), docLibId, recId);

            return new HashMap<>();
        }

        return response.getBody();
    }

    public boolean patchCurrentLibRecordField(String token,
                                              String docLibId,
                                              Long recId,
                                              String fieldName,
                                              List<FileDescription> fieldState) throws HttpClientException {
        ResponseModel<Object> response = dataServiceClient.patchLibRecordField(token,
                                                                               docLibId,
                                                                               recId,
                                                                               fieldName,
                                                                               fieldState);

        if (!response.isSuccessful()) {
            log.warn("Не удалось обновить поле записи библиотеки. Код: {}, docLibId: {}, recId: {}, fieldName: {}",
                     response.getCode(), docLibId, recId, fieldName);

            return false;
        }

        return true;
    }

    //TODO: переписывать!
    public String getFilePathById(String token, String uuid) {
        ResponseModel<FileResponse> response;
        try {
            response = dataServiceClient.getFileById(token, uuid);
        } catch (HttpClientException e) {
            throw new RuntimeException(e);
        }

        if (response.isSuccessful()) {
            return response.getBody().getPath();
        }

        return "Кидать ошибку!";
    }

    public boolean getTableAvailabilityByIdentifier(String token, String sourceId) {
        Page<Object> response;
        try {
            response = dataServiceClient.getTableWithFilter(token, createCustomFilter(sourceId));
        } catch (HttpClientException e) {
            return false;
        }

        return response.getTotalElements() > 0;
    }

    private String createCustomFilter(String sourceId) {
        return "?page=0&size=2&filter=(identifier+%3D+%27" + sourceId + "%27)";
    }
}
