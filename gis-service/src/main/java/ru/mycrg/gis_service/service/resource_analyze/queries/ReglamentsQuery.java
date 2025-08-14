package ru.mycrg.gis_service.service.resource_analyze.queries;

import okhttp3.OkHttpClient;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

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
        List<IResource> result = new ArrayList<>();
        // TODO: Регламенты и их анализатор не актуальны.
        // Collection<String> schemasName = getSchemasNameWithReglaments();

        return new PageImpl<>(result, pageable, result.size());
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }
}
