package ru.mycrg.gis_service.service.resource_analyze.analyzers;

import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.wms.WmsProperties;
import ru.mycrg.geoserver_client.services.wms.WmsService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.impl.ResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;

@Service
public class LayerExistenceByWmsAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(LayerExistenceByWmsAnalyzer.class);

    private final Double[] bbox = new Double[]{3778140.58549765, 5300522.190056069, 3778162.97915828, 5300544.5837167};

    private final IAuthenticationFacade authenticationFacade;

    public LayerExistenceByWmsAnalyzer(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        return resources.stream()
                        .map(this::analyzeResource)
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<IResourceDefinition> getResourceDefinitions() {
        return Arrays.asList(new ResourceDefinition("VectorLayer", "Векторные слои"),
                             new ResourceDefinition("RasterLayer", "Растровые слои"));
    }

    @Override
    public String getId() {
        return "LayerExistenceByWmsAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка доступности слоя по WMS";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "Слой {id} не доступен по WMS на Геосервере";
    }

    @Override
    public int getBatchSize() {
        return 5;
    }

    private ResourceAnalyzerResult analyzeResource(IResource layer) {
        final String layerId = layer.getId();

        try {
            final WmsService wmsService = new WmsService(authenticationFacade.getAccessToken());
            final String scratchWorkspaceName = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
            final String complexLayerName = String.format("%s:%s", scratchWorkspaceName, layerId);
            final WmsProperties props = new WmsProperties(List.of(complexLayerName), bbox);

            Response response = wmsService.getMap(props);
            String responseBody = requireNonNull(response.body()).string();
            if (response.isSuccessful() && !responseBody.contains("ServiceException")) {
                return new ResourceAnalyzerResult(layerId, true);
            } else {
                log.warn("На геосервере, при запросе по WMS(getMap), не доступен слой: {}, статус ответа: {}, тело " +
                                 "ответа: {}", layerId, response.code(), responseBody);

                return new ResourceAnalyzerResult(layerId, false);
            }
        } catch (Exception e) {
            log.warn("При запросе по WMS(getMap) слоя: {}, возникла ошибка: {}", layerId, e.getCause());

            return new ResourceAnalyzerResult(layerId, false);
        }
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
