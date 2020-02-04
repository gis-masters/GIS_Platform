package ru.mycrg.geoserver_client.services.layers;

import okhttp3.Request;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

public class LayersService extends GeoServerBaseService {

    public void delete(String layerName, String jwtToken) throws GeoserverClientException {
        String url = getGeoserverRestUrl()
                .append("/layers/")
                .append(layerName)
                .toString();

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .url(url)
                .delete()
                .build();

        doRequest(request, "Delete layer: " + layerName);
    }
}
