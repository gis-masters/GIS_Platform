package ru.mycrg.gis_service.service.geoserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.gis_service.security.CrgAuthHelper.getToken;
import static ru.mycrg.gis_service.security.CrgClaimsParser.getOrganizationId;

@Service
public class GeoserverLayersHandler {

    public static final Logger log = LoggerFactory.getLogger(GeoserverLayersHandler.class);

    public void deleteLayer(Layer layer, Authentication authentication) {
        String complexLayerName = "";
        try {
            complexLayerName = String.format("scratch_database_%d:%s",
                                             getOrganizationId(authentication), layer.getInternalName());

            ResponseModel<Object> response = new LayersService(getToken(authentication)).delete(complexLayerName);
            if (!response.isSuccessful()) {
                log.warn("Не удалось удалить слой: {} c геосервера. Reason: {}", complexLayerName, response);
            }
        } catch (HttpClientException e) {
            log.warn("Не удалось удалить слой c геосервера: {}", complexLayerName);
        }
    }
}
