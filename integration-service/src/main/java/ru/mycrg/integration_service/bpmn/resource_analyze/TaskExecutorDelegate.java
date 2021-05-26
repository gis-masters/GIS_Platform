package ru.mycrg.integration_service.bpmn.resource_analyze;

import com.google.gson.reflect.TypeToken;
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
import java.util.List;
import java.util.Optional;

import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.enums.ResourceAnalyzeProcessVariables.*;

@Service("taskExecutorDelegate")
public class TaskExecutorDelegate implements JavaDelegate {

    public static final Logger log = LoggerFactory.getLogger(TaskExecutorDelegate.class);

    private String accessToken;
    private Integer currentPage;
    private String resourcesQueryBasePath;
    private List<ResourceAnalyzeTask> tasks;
    private ResourceAnalyzeTask currentTask;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        extractVariables(execution);

        log.debug("Task in progress: {} / Current page: {}", currentTask.getId(), currentPage);

        final Optional<PageModel<ResourcesModel>> oPage = fetchResources(execution, currentTask);
        if (oPage.isPresent()) {
            final PageModel<ResourcesModel> page = oPage.get();
            if (page.getEmbedded() == null) {
                completeTask(execution, currentTask);
            } else {
                execution.setVariable(RESOURCES.name(), page.getEmbedded());
                execution.setVariable(IS_TASK_COMPLETE.name(), false);
            }
        } else {
            log.warn("Failed fetch resources. End task: {}", currentTask.getId());
            completeTask(execution, currentTask);
        }
    }

    private Optional<PageModel<ResourcesModel>> fetchResources(DelegateExecution execution,
                                                               ResourceAnalyzeTask currentTask) {
        ResponseModel<PageModel<ResourcesModel>> response;
        URL url = null;
        try {
            url = buildUrl(execution, currentTask);
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .get()
                    .build();

            response = crgHttpClient.handleRequest(request,
                                                   new TypeToken<PageModel<ResourcesModel>>() {
                                                   }.getType());
            if (response.isSuccessful()) {
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
    private URL buildUrl(DelegateExecution execution, ResourceAnalyzeTask task) throws MalformedURLException {
        final URL serviceRoot = task.getAnalyzer().getUrl();
        final Integer batchSize = task.getAnalyzer().getBatchSize();
        final String resourcePath = String.format("%s/%s/entities?size=%d&page=%d",
                                                  resourcesQueryBasePath,
                                                  task.getResourceType(),
                                                  batchSize,
                                                  currentPage);

        return new URL(serviceRoot, resourcePath);
    }

    private void completeTask(DelegateExecution execution, ResourceAnalyzeTask currentTask) {
        tasks.forEach(task -> {
            if (currentTask.getId().equals(task.getId())) {
                log.debug("Task: {} COMPLETED", task.getId());

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
