package ru.mycrg.geoserver_client.services.layers;

import okhttp3.Request;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

public class LayersService extends GeoServerBaseService {

    public LayersService(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<Object> delete(String layerName) throws HttpClientException {
        String url = getGeoserverRestUrl()
                .append("/layers/")
                .append(layerName)
                .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .delete().build();

        return httpClient.handleRequest(request, Object.class);
    }
}
