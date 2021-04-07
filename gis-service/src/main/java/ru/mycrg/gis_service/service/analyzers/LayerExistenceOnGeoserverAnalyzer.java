package ru.mycrg.gis_service.service.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.security.CrgAuthHelper;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.resource_analyzer_contract.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LayerExistenceOnGeoserverAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(LayerExistenceOnGeoserverAnalyzer.class);
    private final IAuthenticationFacade authenticationFacade;

    public LayerExistenceOnGeoserverAnalyzer(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    private ResourceAnalyzerResultImpl checkLayerExistenceOnGeoserver(IResource layer) {
        LayersService geoserverLayerService = new LayersService(
                CrgAuthHelper.getToken(authenticationFacade.getAuthentication()));
        boolean isExistOnGeoserver = true;

        try {
            isExistOnGeoserver = geoserverLayerService.getByName(layer.getId()).isPresent();
            if (!isExistOnGeoserver) {
                log.warn("layer doesn't exist on geoserver: {}", layer.getId());
            }
        } catch (Exception e) {
            log.warn("something went wrong when checking layer existence on geoserver: {}", layer.getId());
        }

        return new ResourceAnalyzerResultImpl(layer.getId(), isExistOnGeoserver);
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        List<ResourceAnalyzerResultImpl> resourcesCheckResults = resources
                .stream()
                .map(this::checkLayerExistenceOnGeoserver)
                .collect(Collectors.toList());

        return Collections.unmodifiableList(resourcesCheckResults);
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return new ResourceDefinitionImpl("Layer", "Слой");
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
        return "{title} отсутствует на Geoserver";
    }

    @Override
    public int getBatchSize() {
        return 5;
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        resources.forEach(resource -> {
            if (resource.getId() == null) {
                throw new BadRequestException("Not null object expected");
            }

            if (!isResourceTypeSame(resource)) {
                throw new BadRequestException("Не подходит тип ресурса", new ErrorInfo("type", "Требуется layer"));
            }
        });
    }

    private boolean isResourceTypeSame(IResource resource) {
        return resource.getResourceDefinition()
                       .getType()
                       .equals(this.getResourceDefinition().getType());
    }
}
