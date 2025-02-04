package ru.mycrg.gis_service.service.resource_analyze.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.layers.VectorLayer;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.impl.ResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VectorLayerDefaultStyleAnalyzer implements IResourceAnalyzer {

    private final Logger log = LoggerFactory.getLogger(VectorLayerDefaultStyleAnalyzer.class);

    private final LayerService layerService;
    private final IAuthenticationFacade authenticationFacade;

    private final URL gisServiceUrl;

    public VectorLayerDefaultStyleAnalyzer(LayerService layerService,
                                           Environment environment,
                                           IAuthenticationFacade authenticationFacade) throws MalformedURLException {
        this.layerService = layerService;
        this.authenticationFacade = authenticationFacade;

        this.gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    /**
     * return analysis results when analyzing layer default style on Geoserver and on Gis service
     *
     * @param resources - short model of vector layer projection
     *
     * @return analysis results
     *
     * @throws BadRequestException if found inappropriate resource type
     */
    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        return resources.stream()
                        .map(this::analyzeVectorLayerForDefaultStyle)
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<IResourceDefinition> getResourceDefinitions() {
        return Collections.singletonList(new ResourceDefinition("VectorLayer", "Векторные слои"));
    }

    @Override
    public String getId() {
        return "VectorLayerDefaultStyleAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка векторных слоёв на соответствие стиля по умолчанию";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "У слоя {id} стиль по-умолчанию на Геосервере отличается от указанного у нас";
    }

    @Override
    public int getBatchSize() {
        return 10;
    }

    @Override
    public URL getReceiveDataUrl() {
        return gisServiceUrl;
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        resources.forEach(resource -> {
            if (!getResourceDefinitions().contains(resource.getResourceDefinition())) {
                throw new BadRequestException("Не подходит тип ресурса",
                                              new ErrorInfo("type", "Требуется vector layer"));
            }
        });
    }

    private boolean isLayersHaveSameStyle(Layer layerFromGeoserver, LayerProjection layerFromGisService) {
        return layerFromGeoserver.getDefaultStyle()
                                 .getName()
                                 .equals(layerFromGisService.getStyleName());
    }

    private ResourceAnalyzerResult analyzeVectorLayerForDefaultStyle(IResource vectorLayer) {
        boolean isSameStyle = false;
        VectorLayer geoserverLayerService = new VectorLayer(authenticationFacade.getAccessToken());

        try {
            boolean isLayerExistOnGeoserver = geoserverLayerService.getByName(vectorLayer.getId()).isPresent();

            if (isLayerExistOnGeoserver) {
                Layer layerFromGeoserver = geoserverLayerService
                        .getByName(vectorLayer.getId())
                        .orElseThrow(() -> new NotFoundException("Не найден слой: " + vectorLayer.getId()));
                LayerProjection layerFromGisService = layerService.getByTableName(vectorLayer.getId());

                if (isLayersHaveSameStyle(layerFromGeoserver, layerFromGisService)) {
                    isSameStyle = true;
                } else {
                    log.warn("layer has different standard default style {}", vectorLayer.getId());
                }
            } else {
                log.warn("no layer on geoserver : {}", vectorLayer.getId());
            }
        } catch (Exception e) {
            log.warn("layer has some problems: {}", vectorLayer.getId());
        }

        return new ResourceAnalyzerResult(vectorLayer.getId(), isSameStyle);
    }
}
