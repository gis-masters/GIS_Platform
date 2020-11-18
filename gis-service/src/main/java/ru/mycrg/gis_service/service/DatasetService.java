package ru.mycrg.gis_service.service;

import com.google.gson.Gson;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.gis_service.dto.DatasetCreateDto;
import ru.mycrg.gis_service.dto.DatasetDataServiceDto;
import ru.mycrg.gis_service.exceptions.ThirdPartyServiceException;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;

import static ru.mycrg.gis_service.security.CrgAuthHelper.getToken;
import static ru.mycrg.gis_service.security.CrgClaimsParser.getOrganizationId;

@Service
public class DatasetService {

    public static final Logger log = LoggerFactory.getLogger(DatasetService.class);

    private static final Gson gson = new Gson();

    private final HttpClient httpClient;

    private final URL dataServiceUrl;

    public DatasetService(Environment environment) throws MalformedURLException {
        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));

        dataServiceUrl = new URL(environment.getRequiredProperty("crg-options.data-service-url") + "/datasets");
    }

    public void create(DatasetCreateDto dto, Authentication authentication) {
        String accessToken = getToken(authentication);
        Long orgId = getOrganizationId(authentication);
        String datasetName = String.format("dataset_%s", UUID.randomUUID().toString().substring(0, 6));

        createStorageOnGeoserver(orgId, datasetName, accessToken);

        try {
            log.debug("Try create schema {} on data-service", datasetName);

            final String payload = gson.toJson(
                    new DatasetDataServiceDto(datasetName, dto.getTitle(), dto.getDetails()));

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .url(dataServiceUrl)
                    .post(RequestBody.create(MediaType.parse("application/json"), payload))
                    .build();

            ResponseModel<Object> responseModel = httpClient.handleRequest(request);
            if (!responseModel.isSuccessful()) {
                deleteStorageOnGeoserver(orgId, datasetName, accessToken);

                throw new ThirdPartyServiceException("Не удалось создать набор на data-service", responseModel);
            }
        } catch (HttpClientException e) {
            deleteStorageOnGeoserver(orgId, datasetName, accessToken);

            throw new ThirdPartyServiceException("Не удалось создать набор на data-service", e.getCause());
        }
    }

    private void createStorageOnGeoserver(Long orgId, String datasetName, String token) {
        try {
            log.debug("Try create storage {} on geoserver", datasetName);

            final String orgWorkspace = "scratch_database_" + orgId;
            ResponseModel<Object> responseModel = new VectorStorage(token)
                    .create("database_" + orgId, datasetName, orgWorkspace, datasetName);
            if (!responseModel.isSuccessful()) {
                throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", responseModel);
            }
        } catch (HttpClientException e) {
            throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", e.getCause());
        }
    }

    private void deleteStorageOnGeoserver(Long orgId, String datasetName, String token) {
        try {
            log.debug("Try delete storage {} on geoserver", datasetName);

            final String orgWorkspace = "scratch_database_" + orgId;
            ResponseModel<Object> responseModel = new VectorStorage(token).delete(orgWorkspace, datasetName);
            if (!responseModel.isSuccessful()) {
                throw new ThirdPartyServiceException("Не удалось удалить хранилище на геосервере", responseModel);
            }
        } catch (HttpClientException e) {
            throw new ThirdPartyServiceException("Не удалось удалить хранилище на геосервере", e.getCause());
        }
    }
}
