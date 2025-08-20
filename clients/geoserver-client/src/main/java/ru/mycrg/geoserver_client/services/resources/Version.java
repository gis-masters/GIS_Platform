package ru.mycrg.geoserver_client.services.resources;

import okhttp3.Request;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

public class Version extends GeoServerBaseService {

    public Version(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<Object> getMigrationVersion() throws HttpClientException {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/resource/migrationVersion")
                .get()
                .build();

        return httpClient.handleRequest(request, Object.class);
    }
}
