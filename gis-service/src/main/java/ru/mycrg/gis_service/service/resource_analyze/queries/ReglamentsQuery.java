package ru.mycrg.gis_service.service.resource_analyze.queries;

import com.fasterxml.jackson.databind.JsonNode;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;
import ru.mycrg.resource_analyzer_contract.impl.Resource;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

import static java.util.stream.Collectors.toList;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;

@Service
public class ReglamentsQuery implements IResourceQueryService {

    private final String layerType = "vector";

    private final LayerService layerService;
    private final IAuthenticationFacade authenticationFacade;

    private final ResourceDefinition resourceDefinition;
    private final HttpClient httpClient;
    private final URL dataServiceUrl;

    public ReglamentsQuery(LayerService layerService,
                           IAuthenticationFacade authenticationFacade,
                           Environment environment) throws MalformedURLException {
        this.layerService = layerService;
        this.authenticationFacade = authenticationFacade;

        resourceDefinition = new ResourceDefinition("Reglaments", "Регламенты");
        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        this.dataServiceUrl = new URL(environment.getRequiredProperty("crg-options.data-service-url"));
    }

    public Page<IResource> getResources(Pageable pageable) {
        final List<IResource> result = new ArrayList<>();
        try {
            Collection<String> schemasName = getSchemasNameWithReglaments();
            schemasName.forEach(schemaName -> {
                result.addAll(layerService.findLayers(layerType, schemaName, pageable).stream()
                                          .map(this::mapLayerToResource)
                                          .collect(toList()));
            });
        } catch (IOException | HttpClientException e) {
            throw new GisServiceException("Не удалось получить schemaDto.", e.getCause());
        }

        return new PageImpl<>(result, pageable, result.size());
    }

    private Set<String> getSchemasNameWithReglaments() throws HttpClientException, IOException {
        Set<String> schemasNameWithReglaments = new HashSet<>();
        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                .url(new URL(dataServiceUrl, "/reglaments_schemas"))
                .get()
                .build();
        Object responseBody = httpClient.handleRequest(request).getBody();

        JsonNode schemas = objectMapper.readTree(objectMapper.writeValueAsString(responseBody));
        schemas.forEach(schema -> schemasNameWithReglaments.add(schema.get("name").asText()));

        return schemasNameWithReglaments;
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    private IResource mapLayerToResource(Layer layer) {
        final Map<String, Object> resProps = new HashMap<>();
        resProps.put("dataset", layer.getDataset());
        resProps.put("tableName", layer.getTableName());
        resProps.put("title", layer.getTitle());

        return new Resource(layer.getTableName(), layer.getTitle(), resourceDefinition, resProps);
    }
}
