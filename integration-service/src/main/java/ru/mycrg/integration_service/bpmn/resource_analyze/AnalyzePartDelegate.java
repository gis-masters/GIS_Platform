package ru.mycrg.integration_service.bpmn.resource_analyze;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.integration_service.dto.ResourceAnalyzeTask;
import ru.mycrg.integration_service.dto.ResourcesModel;
import ru.mycrg.resource_analyzer_contract.impl.ResourceAnalyzerResult;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.http_client.JsonConverter.toJson;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.enums.ResourceAnalyzeProcessVariables.*;

@Service("analyzePartDelegate")
public class AnalyzePartDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AnalyzePartDelegate.class);

    private final MediaType jsonMediaType = MediaType.parse("application/json");

    private String accessToken;
    private Integer currentPage;
    private ResourceAnalyzeTask currentTask;
    private String resourceAnalyzeBasePath;
    private ResourcesModel resourcesModel;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        extractVariables(execution);

        log.debug("Analyze part. Page: {}", currentPage);

        analyze().ifPresent(response -> {
            response.forEach(analyzeResult -> {
                final String resourceId = analyzeResult.getId();
                final String analyzerId = currentTask.getAnalyzer().getId();

                if (!analyzeResult.isPassed()) {
                    log.warn("Resource analyze results. For resource: '{}' by analyzer: '{}'. ErrorMsg: {}",
                             resourceId, analyzerId, prepareErrorMsg(analyzeResult));
                }
            });
        });

        execution.setVariable(CURRENT_PAGE.name(), ++currentPage);
    }

    private Optional<List<ResourceAnalyzerResult>> analyze() {
        ResponseModel<List<ResourceAnalyzerResult>> response;
        URL url = null;
        try {
            final String jsonBody = toJson(resourcesModel.getResources());
            final RequestBody requestBody = RequestBody.create(jsonMediaType, jsonBody);

            url = buildUrl();
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .post(requestBody)
                    .build();

            response = crgHttpClient.handleRequest(request,
                                                   new TypeReference<>() {
                                                   });
            if (response.isSuccessful()) {
                return Optional.of(response.getBody());
            } else {
                log.error("Failed analyze part of resources. Response code: '{}'. Body: {}",
                          response.getCode(), jsonBody);
            }
        } catch (MalformedURLException e) {
            log.error("Failed to build url for analyze part of resources.", e.getCause());
        } catch (HttpClientException e) {
            log.error("Failed to analyze part of resources. By url: {}", url, e.getCause());
        }

        return Optional.empty();
    }

    @NotNull
    private URL buildUrl() throws MalformedURLException {
        final String analyzerId = currentTask.getAnalyzer().getId();
        final URL serviceRoot = currentTask.getAnalyzer().getUrl();

        // http://localhost:8082/resource-analyzers/LayerStyleExistenceOnGeoserverAnalyzer/analyze
        final String resourcePath = String.format("%s/%s/analyze", resourceAnalyzeBasePath, analyzerId);

        return new URL(serviceRoot, resourcePath);
    }

    private String prepareErrorMsg(ResourceAnalyzerResult analyzeResult) {
        final String errorMessageTemplate = currentTask.getAnalyzer().getErrorMessageTemplate();

        if (errorMessageTemplate == null) {
            return "No error message template";
        }

        return errorMessageTemplate.replace("{id}", analyzeResult.getId());
    }

    private void extractVariables(DelegateExecution execution) {
        currentPage = (Integer) execution.getVariable(CURRENT_PAGE.name());
        currentTask = (ResourceAnalyzeTask) execution.getVariable(CURRENT_TASK.name());
        resourceAnalyzeBasePath = (String) execution.getVariable(RESOURCE_ANALYZE_BASE_PATH.name());
        accessToken = (String) execution.getVariable(ACCESS_TOKEN.name());
        resourcesModel = (ResourcesModel) execution.getVariable(RESOURCES.name());
    }
}
