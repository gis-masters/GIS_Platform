package ru.mycrg.geoserver_client.services.resources;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

public class Svg extends GeoServerBaseService {

    public Svg(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<String> getSvg(String filePath) throws HttpClientException {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/resource/styles/" + filePath)
                .get()
                .build();

        return httpClient.handleRequestAsString(request);
    }

    public void postSvg(String relativePath, String actualBody) throws HttpClientException {
        RequestBody body = RequestBody.create(
                MediaType.parse("image/svg+xml"), actualBody);

        Request request = builderWithBearerAuth.url(getGeoserverRestUrl() + "/resource/styles/" + relativePath)
                                               .put(body)
                                               .build();

        httpClient.handleRequestAsString(request);
    }
}
