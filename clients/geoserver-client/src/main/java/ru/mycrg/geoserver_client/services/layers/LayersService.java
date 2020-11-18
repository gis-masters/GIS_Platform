package ru.mycrg.geoserver_client.services.layers;

import okhttp3.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

public class LayersService extends GeoServerBaseService {

    public static final Logger log = LoggerFactory.getLogger(LayersService.class);

    public LayersService(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<Object> delete(String layerName) throws HttpClientException {
        String url = getGeoserverRestUrl().append("/layers/")
                                          .append(layerName)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .delete().build();

        return httpClient.handleRequest(request, Object.class);
    }

    public ResponseModel<Object> delete(String workspaceName, String layerName) throws HttpClientException {
        log.info("try delete layer: {} from: {}", layerName, workspaceName);

        String url = getGeoserverRestUrl().append("/workspaces/").append(workspaceName)
                                          .append("/layers/").append(layerName)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .delete().build();

        return httpClient.handleRequest(request, Object.class);
    }
}
