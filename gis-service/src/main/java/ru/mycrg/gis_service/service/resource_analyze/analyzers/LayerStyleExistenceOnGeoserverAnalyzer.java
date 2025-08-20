package ru.mycrg.gis_service.service.resource_analyze.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
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
public class LayerStyleExistenceOnGeoserverAnalyzer implements IResourceAnalyzer {

    private final Logger log = LoggerFactory.getLogger(LayerStyleExistenceOnGeoserverAnalyzer.class);

    private final IAuthenticationFacade authenticationFacade;

    private final URL gisServiceUrl;

    public LayerStyleExistenceOnGeoserverAnalyzer(Environment environment, IAuthenticationFacade authenticationFacade)
            throws MalformedURLException {
        this.authenticationFacade = authenticationFacade;

        this.gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        return resources.stream()
                        .map(this::analyzeLayerForStyleExistenceOnGeoserver)
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<IResourceDefinition> getResourceDefinitions() {
        return Collections.singletonList(new ResourceDefinition("VectorLayer", "Векторные слои"));
    }

    @Override
    public String getId() {
        return "LayerStyleExistenceOnGeoserverAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка существования стиля для слоя на Геосервере";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "Для слоя {id} не задан стиль";
    }

    @Override
    public int getBatchSize() {
        return 20;
    }

    @Override
    public URL getReceiveDataUrl() {
        return gisServiceUrl;
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        resources.forEach(resource -> {
            if (!getResourceDefinitions().contains(resource.getResourceDefinition())) {
                throw new BadRequestException("Не подходит тип ресурса", new ErrorInfo("type", "Требуется layer"));
            }
        });
    }

    private ResourceAnalyzerResult analyzeLayerForStyleExistenceOnGeoserver(IResource layer) {
        StyleService geoserverStyleService = new StyleService(authenticationFacade.getAccessToken());
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

        return new ResourceAnalyzerResult(layer.getId(), isStyleExistOnGeoserver);
    }
}
