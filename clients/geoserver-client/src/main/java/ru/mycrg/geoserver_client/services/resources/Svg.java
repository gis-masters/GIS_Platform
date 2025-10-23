package ru.mycrg.geoserver_client.services.resources;

import okhttp3.Request;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

public class Svg extends GeoServerBaseService {

    public Svg(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<String> getSvg(String filePath) throws HttpClientException {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/resource/" + filePath)
                .get()
                .build();

        return httpClient.handleRequestAsString(request);
    }
}
