package ru.mycrg.data_service.service.resources;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;

import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_MEDIA_TYPE;

@Service
public class DataStoreClient {

    private final Logger log = LoggerFactory.getLogger(DataStoreClient.class);

    private final HttpClient httpClient;
    private final IAuthenticationFacade authenticationFacade;

    private final URL gisServiceUrl;

    public DataStoreClient(Environment environment,
                           IAuthenticationFacade authenticationFacade) throws MalformedURLException {
        this.authenticationFacade = authenticationFacade;

        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));

        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    public ResponseModel<Object> create(String dataStoreName) {
        try {
            String accessToken = authenticationFacade.getAccessToken();
            log.debug("Try create dataStore: '{}' via gis-service on geoserver as: '{}'", dataStoreName, accessToken);

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .url(new URL(gisServiceUrl, "/geoserver/datastores/" + dataStoreName))
                    .post(RequestBody.create(DEFAULT_MEDIA_TYPE, ""))
                    .build();

            ResponseModel<String> responseModel = httpClient.handleRequestAsString(request);

            return new ResponseModel<>(responseModel, responseModel.getBody());
        } catch (HttpClientException | MalformedURLException e) {
            throw new DataServiceException("Не удалось создать хранилище на gis-service", e.getCause());
        }
    }

    public ResponseModel<Object> delete(String dataStoreName) {
        try {
            log.debug("Try delete schema {} on data-service", dataStoreName);

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, "/geoserver/datastores/" + dataStoreName))
                    .delete().build();

            return httpClient.handleRequest(request);
        } catch (HttpClientException | MalformedURLException e) {
            throw new DataServiceException("Не удалось удалить хранилище на gis-service", e.getCause());
        }
    }
}
