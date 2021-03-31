package ru.mycrg.gis_service.service.analyzer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.security.CrgAuthHelper;
import ru.mycrg.gis_service.service.LayerService;
import ru.mycrg.resource_analyzer_contract.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VectorLayerDefaultStyleAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(VectorLayerDefaultStyleAnalyzer.class);

    private final LayerService layerService;

    public VectorLayerDefaultStyleAnalyzer(LayerService layerService) {
        this.layerService = layerService;
    }

    /**
     * return analysis results when analyzing layer default style on Geoserver and on Gis service
     *
     * @param resources - short model of vector layer projection
     *
     * @return analysis results
     *
     * @throws GisServiceException if found inappropriate resource type
     */
    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        List<ResourceAnalyzerResultImpl> resourcesCheckResults = resources
                .stream()
                .map(this::analyzeVectorLayerForDefaultStyle)
                .collect(Collectors.toList());

        return Collections.unmodifiableList(resourcesCheckResults);
    }

    @Override
    public ResourceDefinitionImpl getResourceDefinition() {
        return new ResourceDefinitionImpl("VectorLayer", "Векторный слой");
    }

    @Override
    public String getId() {
        return "VectorLayerDefaultStyleAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка векторных слоёв на стиль по умолчанию";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "{title} имеет неправильный стиль по-умолчанию";
    }

    @Override
    public int getBatchSize() {
        return 5;
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        resources.forEach(resource -> {
            if (!isResourceTypeSame(resource)) {
                throw new GisServiceException("Не подходит тип ресурса");
            }
        });
    }

    private boolean isResourceTypeSame(IResource resource) {
        return resource.getResourceDefinition()
                       .getType()
                       .equals(this.getResourceDefinition().getType());
    }

    private boolean isLayersHaveSameStyle(Layer layerFromGeoserver, LayerProjection layerFromGisService) {
        return layerFromGeoserver.getDefaultStyle()
                                 .getName()
                                 .equals(layerFromGisService.getStyleName());
    }

    private ResourceAnalyzerResultImpl analyzeVectorLayerForDefaultStyle(IResource vectorLayer) {
        boolean isSameStyle = false;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            LayersService geoserverLayerService = new LayersService(CrgAuthHelper.getToken(authentication));

            Layer layerFromGeoserver = geoserverLayerService.getByLayerName(vectorLayer.getId()).get();
            LayerProjection layerFromGisService = layerService.findByTableName(vectorLayer.getId(), authentication);

            if (isLayersHaveSameStyle(layerFromGeoserver, layerFromGisService)) {
                isSameStyle = true;
            } else {
                log.warn("layer has different standard default style {}", vectorLayer.getId());
            }
        } catch (Exception e) {
            log.warn("layer has some problems: {}", vectorLayer.getId());
        }

        return new ResourceAnalyzerResultImpl(vectorLayer.getId(), isSameStyle);
    }
}
