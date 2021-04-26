package ru.mycrg.gis_service.service.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.security.CrgAuthHelper;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.gis_service.service.LayerService;
import ru.mycrg.resource_analyzer_contract.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VectorLayerDefaultStyleAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(VectorLayerDefaultStyleAnalyzer.class);

    private final LayerService layerService;
    private final IAuthenticationFacade authenticationFacade;

    public VectorLayerDefaultStyleAnalyzer(LayerService layerService,
                                           IAuthenticationFacade authenticationFacade) {
        this.layerService = layerService;
        this.authenticationFacade = authenticationFacade;
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
    public ResourceDefinitionImpl getResourceDefinition() {
        return new ResourceDefinitionImpl("vector", "Векторный слой");
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
                throw new BadRequestException("Не подходит тип ресурса",
                                              new ErrorInfo("type", "Требуется vector layer"));
            }
        });
    }

    private boolean isResourceTypeSame(IResource resource) {
        return resource.getResourceProperties().get("type")
                       .equals(this.getResourceDefinition().getType());
    }

    private boolean isLayersHaveSameStyle(Layer layerFromGeoserver, LayerProjection layerFromGisService) {
        return layerFromGeoserver.getDefaultStyle()
                                 .getName()
                                 .equals(layerFromGisService.getStyleName());
    }

    private ResourceAnalyzerResultImpl analyzeVectorLayerForDefaultStyle(IResource vectorLayer) {
        boolean isSameStyle = false;
        LayersService geoserverLayerService = new LayersService(
                CrgAuthHelper.getToken(authenticationFacade.getAuthentication()));

        try {
            boolean isLayerExistOnGeoserver = geoserverLayerService.getByName(vectorLayer.getId()).isPresent();

            if (isLayerExistOnGeoserver) {
                Layer layerFromGeoserver =
                        geoserverLayerService.getByName(vectorLayer.getId())
                                             .orElseThrow(() -> new NotFoundException(vectorLayer.getId()));
                LayerProjection layerFromGisService = layerService.findByTableName(vectorLayer.getId());
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

        return new ResourceAnalyzerResultImpl(vectorLayer.getId(), isSameStyle);
    }
}
