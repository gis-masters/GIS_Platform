package ru.mycrg.integration_service.service;

import com.google.gson.reflect.TypeToken;
import okhttp3.Request;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.dto.ResourceAnalyzeModel;
import ru.mycrg.integration_service.dto.ResourceAnalyzeTask;
import ru.mycrg.integration_service.exceptions.NotFoundException;
import ru.mycrg.integration_service.security.IAuthenticationFacade;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.RESOURCE_ANALYZE_PROCESS;
import static ru.mycrg.integration_service.bpmn.enums.ResourceAnalyzeProcessVariables.*;

@Service
public class ResourceAnalyzerService {

    public static final Logger log = LoggerFactory.getLogger(ResourceAnalyzerService.class);

    private final RuntimeService bpmnRuntimeService;
    private final IAuthenticationFacade authenticationFacade;

    private final List<URL> knownServices;
    private final String resourcesQueryBasePath;
    private final String resourceAnalyzersBasePath;

    public ResourceAnalyzerService(IAuthenticationFacade authenticationFacade,
                                   RuntimeService bpmnRuntimeService,
                                   BaseHttpService baseHttpService,
                                   Environment environment) {
        this.bpmnRuntimeService = bpmnRuntimeService;
        this.authenticationFacade = authenticationFacade;

        knownServices = Arrays.asList(baseHttpService.getGisServiceUrl(), baseHttpService.getDataServiceUrl());
        resourcesQueryBasePath = environment.getRequiredProperty("crg-options.resources_query_base_path");
        resourceAnalyzersBasePath = environment.getRequiredProperty("crg-options.resource_analyzers_base_path");
    }

    public String analyze(String resourceType) {
        if (resourceType != null && getAnalyzersByResourceType(resourceType).isEmpty()) {
            throw new NotFoundException("No exist resourceType: " + resourceType);
        }

        final List<ResourceAnalyzeModel> foundedAnalyzers;
        if (resourceType == null) {
            foundedAnalyzers = getAllAnalyzers();
        } else {
            foundedAnalyzers = getAnalyzersByResourceType(resourceType);
        }

        final List<ResourceAnalyzeTask> tasks = prepareTasks(resourceType, foundedAnalyzers);
        log.debug("Start analyze process. Where are: {} tasks", tasks.size());

        final VariableMap variables = Variables.putValue(TASKS.name(), asJava(tasks))
                                               .putValue(RESOURCES_QUERY_BASE_PATH.name(),
                                                         resourcesQueryBasePath)
                                               .putValue(RESOURCE_ANALYZE_BASE_PATH.name(),
                                                         resourceAnalyzersBasePath)
                                               .putValue(ACCESS_TOKEN.name(),
                                                         authenticationFacade.getAccessToken());

        final ProcessInstance processInstance = bpmnRuntimeService
                .startProcessInstanceByKey(RESOURCE_ANALYZE_PROCESS.getValue(),
                                           resourceType + "_" + UUID.randomUUID().toString().substring(0, 8),
                                           variables);

        return processInstance.getProcessInstanceId();
    }

    public List<ResourceAnalyzeModel> getAllAnalyzers() {
        final List<ResourceAnalyzeModel> analyzers = new ArrayList<>();

        knownServices.forEach(serviceUrl -> analyzers.addAll(fetchAnalyzers(serviceUrl)));

        return analyzers;
    }

    public Set<IResourceDefinition> getExistedDefinitions() {
        Set<IResourceDefinition> result = new HashSet<>();

        getAllAnalyzers().stream()
                         .map(ResourceAnalyzeModel::getResourceDefinitions)
                         .forEach(result::addAll);

        return result;
    }

    private List<ResourceAnalyzeTask> prepareTasks(String resourceType, List<ResourceAnalyzeModel> analyzers) {
        List<ResourceAnalyzeTask> tasks = new ArrayList<>();

        analyzers.forEach(analyzersModel -> {
            analyzersModel.getResourceDefinitions()
                          .forEach(resourceDefinition -> {
                              if (resourceType == null) {
                                  tasks.add(new ResourceAnalyzeTask(resourceDefinition.getType(), analyzersModel));
                              } else if (resourceType.equals(resourceDefinition.getType())) {
                                  tasks.add(new ResourceAnalyzeTask(resourceType, analyzersModel));
                              }
                          });
        });

        return tasks;
    }

    private List<ResourceAnalyzeModel> getAnalyzersByResourceType(String resourceType) {
        return getAllAnalyzers().stream()
                                .filter(analyzersModel -> isAnalyzerCompatible(analyzersModel, resourceType))
                                .collect(Collectors.toList());
    }

    private boolean isAnalyzerCompatible(ResourceAnalyzeModel analyzersModel, String resourceType) {
        return analyzersModel.getResourceDefinitions().stream()
                             .anyMatch(resourceDefinition -> resourceType.equals(resourceDefinition.getType()));
    }

    @NotNull
    private List<ResourceAnalyzeModel> fetchAnalyzers(URL serviceUrl) {
        ResponseModel<List<ResourceAnalyzeModel>> response;
        try {
            Request request = new Request.Builder()
                    .url(new URL(serviceUrl, "/resource-analyzers"))
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .get()
                    .build();

            response = crgHttpClient.handleRequest(request,
                                                   new TypeToken<ArrayList<ResourceAnalyzeModel>>() {
                                                   }.getType());
            if (response.isSuccessful()) {
                final List<ResourceAnalyzeModel> analyzersModels = response.getBody();
                analyzersModels.forEach(analyzersModel -> analyzersModel.setUrl(serviceUrl));

                return analyzersModels;
            } else {
                log.error("Failed fetch analyzers. Response code: {}", response.getCode());
            }
        } catch (HttpClientException e) {
            log.error("Failed get resource analyzers info by: {}", serviceUrl, e.getCause());
        } catch (MalformedURLException e) {
            log.error("Incorrect service url: {}", serviceUrl, e.getCause());
        }

        return new ArrayList<>();
    }
}
