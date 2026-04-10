package ru.mycrg.integration_service.bpmn.gpkg.import_.main;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import tools.jackson.databind.JsonNode;

import java.util.Optional;

import static ru.mycrg.http_client.JsonConverter.toJsonNodeFromString;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.CREATE_GROUP_IN_PROJECT_FAIL;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.GROUP_CREATE_HTTP_FAILED;

@Service("createGroupInProject")
public class CreateGroupInProject implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateGroupInProject.class);

    private final BaseHttpService baseHttpService;

    public CreateGroupInProject(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу.", CreateGroupInProject.class.getSimpleName());

        int currentIteration = (int) delegateExecution.getVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS);
        if (currentIteration >= 4) {
            String msg = "Превышено максимальное количество попыток создания группы слоёв в проекте!!!";
            log.warn(msg);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, GROUP_CREATE_HTTP_FAILED.getValue());

            throw new BpmnError("createGroupInProjectFail", msg);
        }

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);

        Optional<Long> groupId = createParentGroup(event.getToken(),
                                                   event.getProjectId(),
                                                   event.getTargetDatasetTitle(),
                                                   delegateExecution,
                                                   currentIteration);

        if (groupId.isPresent()) {
            //TODO: У нас в модели репорта есть "Проект", нужно бы хранить это там, а не в переменной процесса
            delegateExecution.setVariable(IMPORT_GPKG_CREATED_LAYER_GROUP_ID, groupId.get());
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0);
        } else {
            String msg = "Не удалось создать группу слоёв в проекте!!!";
            log.warn(msg);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, CREATE_GROUP_IN_PROJECT_FAIL.getValue());

            throw new BpmnError("createGroupInProjectFail", msg);
        }
    }

    private Optional<Long> createParentGroup(String token,
                                             Long projectId,
                                             String title,
                                             DelegateExecution delegateExecution,
                                             int currentIteration) {

        String jsonBody = "{"
                + "\"title\": \"" + title + "\","
                + "\"enabled\": true,"
                + "\"expanded\": true,"
                + "\"position\": -1,"
                + "\"transparency\": 100"
                + "}";

        RequestBody requestBody = RequestBody.create(
                MediaType.parse("application/json"),
                jsonBody
        );

        String fullUrl = baseHttpService.getGisServiceUrl() + "/projects/" + projectId + "/groups";
        log.debug("fullUrl: {}", fullUrl);

        Request request = new Request.Builder()
                .url(fullUrl)
                .post(requestBody)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + token)
                .build();

        try {
            ResponseModel<String> response = crgHttpClient.handleRequestAsString(request);
            if (response.isSuccessful()) {
                String responseBody = response.getBody();

                JsonNode jsonNode = toJsonNodeFromString(responseBody);

                return Optional.of(jsonNode.get("id").asLong());
            } else {
                int statusCode = response.getCode();
                log.warn("GIS сервис вернул неуспешный статус: {} для создания группы в проекте с ID: {}", statusCode,
                         projectId);

                // Временные ошибки - можно повторить
                if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                    delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
            }
        } catch (Exception e) {
            log.error("Ошибка при создании группы в проекте с ID {}: {}", projectId, e.getMessage(), e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }

        return Optional.empty();
    }
}
