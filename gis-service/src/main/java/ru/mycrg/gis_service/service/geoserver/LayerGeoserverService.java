package ru.mycrg.gis_service.service.geoserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

@Service
public class LayerGeoserverService {

    private final IAuthenticationFacade authenticationFacade;

    private final Logger log = LoggerFactory.getLogger(LayerGeoserverService.class);

    public LayerGeoserverService(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public boolean isLayerExist(String dataStoreName, String tableName) throws HttpClientException {
        log.debug("feature exist: {} on geoserver workspace: {} ", tableName, dataStoreName);

        return new FeatureTypeService(authenticationFacade.getAccessToken())
                .isExist(dataStoreName, tableName);
    }

    public ResponseModel<Object> createLayer(Layer layer) throws HttpClientException {
        String tableName = layer.getTableName();
        String dataset = layer.getDataset();
        String dataStoreName = layer.getDataStoreName();

        log.debug("Publish feature: {} on geoserver workspace: {} Datastore: {}", tableName, dataset, dataStoreName);

        Integer crs = extractCrsNumber(layer.getNativeCRS());

        return new FeatureTypeService(authenticationFacade.getAccessToken())
                .create(dataStoreName, dataset, tableName, crs);
    }

    private Integer extractCrsNumber(String crs) {
        try {
            String[] splitCrs = crs.split(":");

            return Integer.valueOf(splitCrs[1]);
        } catch (Exception ex) {
            String errorMsg = "Error while getting crs number(srid)." + ex.getMessage();
            log.error(errorMsg);

            throw new GisServiceException(errorMsg);
        }
    }
}
