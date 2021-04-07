package ru.mycrg.gis_service.service.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.security.CrgAuthHelper;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.resource_analyzer_contract.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LayerStyleExistenceOnGeoserverAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(LayerStyleExistenceOnGeoserverAnalyzer.class);
    private final IAuthenticationFacade authenticationFacade;

    public LayerStyleExistenceOnGeoserverAnalyzer(
            IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        List<ResourceAnalyzerResultImpl> resourcesCheckResults = resources
                .stream()
                .map(this::analyzeLayerForStyleExistenceOnGeoserver)
                .collect(Collectors.toList());

        return Collections.unmodifiableList(resourcesCheckResults);
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return new ResourceDefinitionImpl("Layer", "Слой");
    }

    @Override
    public String getId() {
        return "LayerStyleExistenceOnGeoserverAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка существования стиля для слоя на Geoserver";
    }

    @Override
    public String getErrorMessageTemplate() {
        return null;
    }

    @Override
    public int getBatchSize() {
        return 5;
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        resources.forEach(resource -> {
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

    private ResourceAnalyzerResultImpl analyzeLayerForStyleExistenceOnGeoserver(IResource layer) {
        StyleService geoserverStyleService = new StyleService(
                CrgAuthHelper.getToken(authenticationFacade.getAuthentication()));
        boolean isStyleExistOnGeoserver = true;

        try {
            isStyleExistOnGeoserver = geoserverStyleService.getByName(
                    layer.getResourceProperties().get("styleName").toString()).isPresent();

            if (!isStyleExistOnGeoserver) {
                log.warn("style for layer doesn't exist on geoserver: {}", layer.getId());
            }
        } catch (Exception e) {
            log.warn("something went wrong when checking layer existence on geoserver: {}", layer.getId());
        }

        return new ResourceAnalyzerResultImpl(layer.getId(), isStyleExistOnGeoserver);
    }
}
