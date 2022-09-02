package ru.mycrg.gis_service.service.resource_analyze.analyzers;

import com.fasterxml.jackson.databind.JsonNode;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.layers.VectorLayer;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.geoserver_client.services.wms.WmsProperties;
import ru.mycrg.geoserver_client.services.wms.WmsService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.impl.ResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;
import static ru.mycrg.geoserver_client.services.GeoServerBaseService.httpClient;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;

@Service
public class BaseMapsExistenceByWmsAnalyzer implements IResourceAnalyzer {

    private final Logger log = LoggerFactory.getLogger(BaseMapsExistenceByWmsAnalyzer.class);

    private final IAuthenticationFacade authenticationFacade;

    private final URL dataServiceUrl;

    public BaseMapsExistenceByWmsAnalyzer(Environment environment,
                                          IAuthenticationFacade authenticationFacade) throws MalformedURLException {
        this.authenticationFacade = authenticationFacade;

        this.dataServiceUrl = new URL(environment.getRequiredProperty("crg-options.data-service-url"));
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesBody(resources);
        final VectorLayer vectorLayer = new VectorLayer(authenticationFacade.getAccessToken());

        return resources.stream()
                        .map(baseMap -> analyzeResource(baseMap, vectorLayer))
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<IResourceDefinition> getResourceDefinitions() {
        return Collections.singletonList(new ResourceDefinition("BaseMaps", "Подложки"));
    }

    @Override
    public String getId() {
        return "BaseMapsExistenceByWmsAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка доступности подложки по WMS";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "Подложка {id} не доступна по WMS на Геосервере";
    }

    @Override
    public int getBatchSize() {
        return 20;
    }

    @Override
    public URL getReceiveDataUrl() {
        return dataServiceUrl;
    }

    private ResourceAnalyzerResult analyzeResource(IResource baseMap, VectorLayer vectorLayer) {
        final String layerName = baseMap.getResourceProperties().get("layerName").toString();
        try {
            Optional<Layer> oLayer = vectorLayer.getByName(layerName);
            if (oLayer.isEmpty()) {
                throw new GisServiceException("Не удалось найти подложку: " + layerName);
            }

            final WmsService wmsService = new WmsService(authenticationFacade.getAccessToken());
            final Double[] bbox = fetchBbox(oLayer.get().getResource().getHref());
            final WmsProperties props = new WmsProperties(List.of(layerName), bbox);

            Response response = wmsService.getMap(props);
            String responseBody = requireNonNull(response.body()).string();
            if (response.isSuccessful() && !responseBody.contains("ServiceException")) {
                return new ResourceAnalyzerResult(layerName, true);
            } else {
                log.warn("На геосервере, при запросе по WMS(getMap), не доступна подложка: {}, статус ответа: {}, " +
                                 "тело ответа: {}", layerName, response.code(), responseBody);

                return new ResourceAnalyzerResult(layerName, false);
            }
        } catch (Exception e) {
            log.warn("При запросе по WMS(getMap) подложки: {}, возникла ошибка: {}", layerName, e.getCause());

            return new ResourceAnalyzerResult(layerName, false);
        }
    }

    @NotNull
    private Double[] fetchBbox(String href) throws IOException, HttpClientException {
        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                .url(href)
                .get().build();
        Object responseBodyByHref = httpClient.handleRequest(request).getBody();

        String json = objectMapper.writer()
                                  .withDefaultPrettyPrinter()
                                  .writeValueAsString(responseBodyByHref);
        JsonNode jsonNode = objectMapper.readTree(json);
        JsonNode nativeBoundingBox = jsonNode.get("coverage").get("nativeBoundingBox");
        String minX = nativeBoundingBox.get("minx").asText();
        String maxX = nativeBoundingBox.get("maxx").asText();
        String minY = nativeBoundingBox.get("miny").asText();
        String maxY = nativeBoundingBox.get("maxy").asText();

        return new Double[]{Double.valueOf(minX), Double.valueOf(minY), Double.valueOf(maxX),
                Double.valueOf(maxY)};
    }

    private void checkResourcesBody(List<? extends IResource> resources) {
        resources.forEach(resource -> {
            if (resource.getId() == null) {
                throw new BadRequestException("Не указан id ресурса", new ErrorInfo("id", "должен быть указан"));
            }

            if (!getResourceDefinitions().contains(resource.getResourceDefinition())) {
                throw new BadRequestException("Не подходит описание ресурса",
                                              new ErrorInfo("resourceDefinition",
                                                            "Требуется: type:BaseMaps и typeTitle:Подложки"));
            }

            if (resource.getResourceProperties().get("layerName") == null) {
                throw new BadRequestException("Отсутствует имя слоя",
                                              new ErrorInfo("resourceProperties.layerName", "должен быть указан"));
            }
        });
    }
}
