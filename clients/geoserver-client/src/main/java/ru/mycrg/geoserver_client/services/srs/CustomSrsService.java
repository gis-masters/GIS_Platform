package ru.mycrg.geoserver_client.services.srs;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class CustomSrsService extends GeoServerBaseService {

    private static final String PATH_TO_EPSG = "/resource/user_projections/epsg.properties";

    public CustomSrsService(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<String> getCustomSrs() throws HttpClientException {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + PATH_TO_EPSG)
                .get().build();

        return httpClient.handleRequestAsString(request);
    }

    public void update(String newProjections) throws HttpClientException {
        httpClient.handleRequest(
                builderWithBearerAuth
                        .url(getGeoserverRestUrl() + PATH_TO_EPSG)
                        .put(RequestBody.create(JSON_MEDIA_TYPE, newProjections))
                        .build());
    }
}
