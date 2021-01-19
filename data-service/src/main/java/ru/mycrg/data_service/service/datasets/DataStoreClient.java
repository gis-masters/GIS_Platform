package ru.mycrg.data_service.service.datasets;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;

import static ru.mycrg.data_service.security.CrgAuthHelper.getToken;

@Service
public class DataStoreClient {

    public static final Logger log = LoggerFactory.getLogger(DataStoreClient.class);

    private final HttpClient httpClient;

    private final URL baseUrl;

    public DataStoreClient(Environment environment) throws MalformedURLException {
        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));

        baseUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    public ResponseModel<Object> create(String dataStoreName, Authentication authentication) {
        try {
            log.debug("Try create dataStore {} via gis-service on geoserver", dataStoreName);

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + getToken(authentication))
                    .url(new URL(baseUrl, "/geoserver/datastores/" + dataStoreName))
                    .post(RequestBody.create(MediaType.parse("application/json"), ""))
                    .build();

            return httpClient.handleRequest(request);
        } catch (HttpClientException | MalformedURLException e) {
            throw new DataServiceException("Не удалось создать хранилище на gis-service", e.getCause());
        }
    }

    public ResponseModel<Object> delete(String dataStoreName, Authentication authentication) {
        try {
            log.debug("Try delete schema {} on data-service", dataStoreName);

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + getToken(authentication))
                    .url(new URL(baseUrl, "/geoserver/datastores/" + dataStoreName))
                    .delete().build();

            return httpClient.handleRequest(request);
        } catch (HttpClientException | MalformedURLException e) {
            throw new DataServiceException("Не удалось удалить хранилище на gis-service", e.getCause());
        }
    }
}
