package ru.mycrg.gis_service.service.geoserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.contracts.featuretypes.FeatureTypeModel;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.security.CrgAuthHandler;
import ru.mycrg.http_client.ResponseModel;

import java.util.Optional;

@Service
public class LayerGeoserverService {

    private final Logger log = LoggerFactory.getLogger(LayerGeoserverService.class);

    private final CrgAuthHandler crgAuthHandler;
    private final IAuthenticationFacade authenticationFacade;

    public LayerGeoserverService(CrgAuthHandler crgAuthHandler,
                                 IAuthenticationFacade authenticationFacade) {
        this.crgAuthHandler = crgAuthHandler;
        this.authenticationFacade = authenticationFacade;
    }

    public Optional<String> create(Layer layer, String featureTypeName, String nativeName) {
        String workspace = layer.getDataStoreName();
        String dataStore = layer.getDataset();
        String nativeCRS = layer.getNativeCRS();

        try {
            log.debug("isLayerExist: '{}'", featureTypeName);
            if (isLayerExist(workspace, featureTypeName)) {
                log.debug("Layer: '{}' already exist.", featureTypeName);

                return Optional.of(featureTypeName);
            }

            FeatureTypeModel featureType = new FeatureTypeModel(featureTypeName, nativeName, nativeCRS);
            log.debug("Попытка публикации слоя: {} в рабочей области: [{}] из хранилища: [{}]",
                      featureType, workspace, dataStore);

            ResponseModel<Object> responseModel = new FeatureTypeService(authenticationFacade.getAccessToken())
                    .create(workspace, dataStore, featureType);

            if (responseModel.isSuccessful()) {
                log.debug("Слой: {} успешно опубликован", featureTypeName);

                return Optional.of(featureTypeName);
            }

            log.debug("Не удалось опубликовать слой: {} => {}", featureTypeName, responseModel.getBody());

            return Optional.empty();
        } catch (Exception e) {
            String msg = String.format("Не удалось опубликовать слой: '%s' на геосервере. Reason: %s",
                                       nativeName, e.getMessage());
            log.error(msg);

            return Optional.empty();
        }
    }

    /**
     * Привязываем стиль к слою.
     * <p>
     * Если желаемый стиль не удалось подключить, подключаем generic. Иначе слой не отображается вовсе.
     * <p>
     * {@code crgAuthHandler.getRootAccessToken()} нужен потому что геосервер ругается:
     * <p>
     * Cannot edit global resource , full admin credentials required. The method received in the request-line is known
     * by the origin server but not supported by the target resource.
     */
    public void associateStyle(String complexLayerName, String styleName) {
        try {
            log.debug("Add style: [{}] to layer: [{}]", styleName, complexLayerName);

            StyleService styleService = new StyleService(crgAuthHandler.getRootAccessToken());

            ResponseModel<Object> associateStyle = styleService.associate(complexLayerName, styleName);
            if (!associateStyle.isSuccessful()) {
                log.warn("Не удалось прикрепить стиль: '{}' к слою: '{}'. По причине: {}",
                         styleName, complexLayerName, associateStyle);

                ResponseModel<Object> associateDefaultStyle = styleService.associate(complexLayerName, "generic");
                if (!associateDefaultStyle.isSuccessful()) {
                    log.error("Не удалось прикрепить generic стиль к слою: '{}'. По причине: {}",
                              complexLayerName, associateDefaultStyle);
                }
            }
        } catch (Exception e) {
            log.warn("Не удалось прикрепить стиль к слою: '{}'. По причине: {}", complexLayerName, e.getMessage());
        }
    }

    private boolean isLayerExist(String workspace, String feature) {
        return new FeatureTypeService(authenticationFacade.getAccessToken())
                .isExist(workspace, feature);
    }
}
