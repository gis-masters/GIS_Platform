package ru.mycrg.geoserver_client.services.layers;

import okhttp3.Request;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

public class LayersService extends GeoServerBaseService {

    public GeoserverClientResponse delete(String layerName, String jwtToken) {
        String url = getGeoserverRestUrl()
                .append("/layers/")
                .append(layerName)
                .toString();

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .url(url)
                .delete()
                .build();

        return doRequest(request);
    }
}
