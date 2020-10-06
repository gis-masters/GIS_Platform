package ru.mycrg.geoserver_client.services.layers;

import okhttp3.Request;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

public class LayersService extends GeoServerBaseService {

    public LayersService(String accessToken) {
        super(accessToken);
    }

    public GeoserverClientResponse delete(String layerName) {
        String url = getGeoserverRestUrl()
                .append("/layers/")
                .append(layerName)
                .toString();

        Request request = builderWithBearerAuth
                .url(url)
                .delete()
                .build();

        return doRequest(request);
    }
}
