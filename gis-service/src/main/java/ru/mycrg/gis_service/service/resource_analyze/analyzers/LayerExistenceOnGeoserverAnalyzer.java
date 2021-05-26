package ru.mycrg.gis_service.service.resource_analyze.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.resource_analyzer_contract.*;
import ru.mycrg.resource_analyzer_contract.impl.ResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LayerExistenceOnGeoserverAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(LayerExistenceOnGeoserverAnalyzer.class);

    private final IAuthenticationFacade authenticationFacade;

    public LayerExistenceOnGeoserverAnalyzer(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        return resources.stream()
                        .map(this::checkLayerExistenceOnGeoserver)
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<IResourceDefinition> getResourceDefinitions() {
        return Arrays.asList(new ResourceDefinition("VectorLayer", "Векторные слои"),
                             new ResourceDefinition("RasterLayer", "Растровые слои"));
    }

    @Override
    public String getId() {
        return "LayerExistenceOnGeoserverAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка существования слоя на Geoserver";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "Слой {id} отсутствует на Геосервере";
    }

    @Override
    public int getBatchSize() {
        return 5;
    }

    private ResourceAnalyzerResult checkLayerExistenceOnGeoserver(IResource layer) {
        LayersService geoserverLayerService = new LayersService(authenticationFacade.getAccessToken());

        boolean isExistOnGeoserver = true;

        try {
            isExistOnGeoserver = geoserverLayerService.getByName(layer.getId()).isPresent();
            if (!isExistOnGeoserver) {
                log.warn("Layer doesn't exist on geoserver: {}", layer.getId());
            }
        } catch (Exception e) {
            log.warn("Something went wrong when checking layer existence on geoserver: {}", layer.getId());
        }

        return new ResourceAnalyzerResult(layer.getId(), isExistOnGeoserver);
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        resources.forEach(resource -> {
            if (resource.getId() == null) {
                throw new BadRequestException("Not null object expected");
            }

            if (!getResourceDefinitions().contains(resource.getResourceDefinition())) {
                throw new BadRequestException("Не подходит тип ресурса", new ErrorInfo("type", "Требуется layer"));
            }
        });
    }
}
