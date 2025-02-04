package ru.mycrg.geoserver_client.services.layers;

import okhttp3.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.geoserver_client.services.layers.models.GeoserverLayerResponse;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Optional;

public class VectorLayer extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(VectorLayer.class);

    public VectorLayer(String accessToken) {
        super(accessToken);
    }

    public Optional<Layer> getByName(String layerName) throws HttpClientException {
        log.info("get layer: {} ", layerName);
        String url = getGeoserverRestUrl().append("/layers/")
                                          .append(layerName)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        GeoserverLayerResponse body = httpClient.handleRequest(request, GeoserverLayerResponse.class)
                                                .getBody();
        if (body != null) {
            Layer layer = httpClient.handleRequest(request, GeoserverLayerResponse.class)
                                    .getBody()
                                    .getLayer();

            return Optional.of(layer);
        } else {
            return Optional.empty();
        }
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
