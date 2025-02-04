package ru.mycrg.integration_service.bpmn.resource_analyze;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.Request;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.integration_service.dto.PageModel;
import ru.mycrg.integration_service.dto.ResourceAnalyzeTask;
import ru.mycrg.integration_service.dto.ResourcesModel;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.enums.ResourceAnalyzeProcessVariables.*;

@Service("taskExecutorDelegate")
public class TaskExecutorDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(TaskExecutorDelegate.class);

    private String accessToken;
    private Integer currentPage;
    private String resourcesQueryBasePath;
    private List<ResourceAnalyzeTask> tasks;
    private ResourceAnalyzeTask currentTask;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        extractVariables(execution);
        Instant startOfTask = Instant.now();

        log.debug("Task in progress: {} / Current page: {}", currentTask.getId(), currentPage);
        log.debug("Starting time {} ", startOfTask);

        final Optional<PageModel<ResourcesModel>> oPage = fetchResources(currentTask);
        if (oPage.isPresent()) {
            final PageModel<ResourcesModel> page = oPage.get();
            if (page.getContent() == null) {
                completeTask(execution, currentTask, startOfTask);
            } else {
                execution.setVariable(RESOURCES.name(), page.getContent());
                execution.setVariable(IS_TASK_COMPLETE.name(), false);
            }
        } else {
            log.warn("Failed fetch resources. End task: {}", currentTask.getId());
            completeTask(execution, currentTask, startOfTask);
        }
    }

    private Optional<PageModel<ResourcesModel>> fetchResources(ResourceAnalyzeTask currentTask) {
        ResponseModel<PageModel<ResourcesModel>> response;
        URL url = null;
        try {
            url = buildUrl(currentTask);
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .get()
                    .build();

            log.debug("request url {}", url);

            response = crgHttpClient.handleRequest(request,
                                                   new TypeReference<>() {
                                                   });
            if (response.isSuccessful()) {
                log.debug("Analyze time fetch resources {}", response.getBody());
                return Optional.of(response.getBody());
            } else {
                log.error("Failed fetch analyzers. Response code: {}", response.getCode());
            }
        } catch (MalformedURLException e) {
            log.error("Failed to build url for fetching resources.", e.getCause());
        } catch (HttpClientException e) {
            log.error("Failed to fetch resources. By url: {}", url, e.getCause());
        }

        return Optional.empty();
    }

    @NotNull
    private URL buildUrl(ResourceAnalyzeTask task) throws MalformedURLException {
        URL serviceRoot = task.getAnalyzer().getReceiveDataUrl();

        final Integer batchSize = task.getAnalyzer().getBatchSize();
        final String resourcePath = String.format("%s/%s/entities?size=%d&page=%d",
                                                  resourcesQueryBasePath,
                                                  task.getResourceType(),
                                                  batchSize,
                                                  currentPage);

        return new URL(serviceRoot, resourcePath);
    }

    private void completeTask(DelegateExecution execution, ResourceAnalyzeTask currentTask, Instant start) {
        tasks.forEach(task -> {
            if (currentTask.getId().equals(task.getId())) {
                long durationOfTask = Duration.between(start, Instant.now()).getSeconds();
                log.debug("Task: {} COMPLETED. Duration time in seconds {} ", task.getId(), durationOfTask);

                task.complete(true);

                execution.setVariable(IS_TASK_COMPLETE.name(), true);
                execution.setVariable(CURRENT_PAGE.name(), 0);
            }
        });
    }

    private void extractVariables(DelegateExecution execution) {
        tasks = (List<ResourceAnalyzeTask>) execution.getVariable(TASKS.name());
        resourcesQueryBasePath = (String) execution.getVariable(RESOURCES_QUERY_BASE_PATH.name());
        currentPage = (Integer) execution.getVariable(CURRENT_PAGE.name());
        currentTask = (ResourceAnalyzeTask) execution.getVariable(CURRENT_TASK.name());
        accessToken = (String) execution.getVariable(ACCESS_TOKEN.name());
    }
}
