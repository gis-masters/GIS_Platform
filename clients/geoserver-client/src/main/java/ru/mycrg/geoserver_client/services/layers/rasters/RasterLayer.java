package ru.mycrg.geoserver_client.services.layers.rasters;

import okhttp3.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Optional;

import static ru.mycrg.geoserver_client.services.layers.VectorLayer.extractLayer;

public class RasterLayer extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(RasterLayer.class);

    public RasterLayer(String accessToken) {
        super(accessToken);
    }

    public Optional<Layer> getByName(String workspace, String layerName) throws HttpClientException {
        log.info("Получаем слой по имени: {} ", layerName);
        String url = getGeoserverRestUrl().append("/workspaces/").append(workspace)
                                          .append("/layers/").append(layerName)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        return extractLayer(request);
    }
}
