package ru.mycrg.integration_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_client.IDataServiceClient;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.ArrayList;
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

    public ResponseModel<Object> patchCurrentRecord(String token,
                                                    String dataset,
                                                    String table,
                                                    Map<String, List<FileDescription>> fileDataProps,
                                                    Long id) throws HttpClientException {
        Map<String, Object> properties = JsonConverter.convertValue(
                fileDataProps,
                new TypeReference<>() {}
        );

        Feature feature = new Feature(properties);
        feature.setId(id);

        return dataServiceClient.patchRecordInTableById(token, dataset, table, feature);
    }
}
