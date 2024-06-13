package ru.mycrg.integration_service.bpmn.org_creation;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;
import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.ITERATION_COUNTER_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("createDbDelegate")
public class CreateDbDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(CreateDbDelegate.class);

    private final BaseHttpService baseHttpService;

    public CreateDbDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        int currentIteration = (int) getVariable(execution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        log.error("Создание БД, осталось попыток: [{}]", currentIteration);

        try {
            Object jsonString = getVariable(execution, EVENT_VAR_NAME, getClass().getName());
            OrganizationInitializedEvent event =
                    objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

            String dbName = getDefaultDatabaseName(event.getOrgId());
            RequestBody body = RequestBody.create(JSON_MEDIA_TYPE,
                                                  objectMapper.writeValueAsBytes(Map.of("name", dbName)));

            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getDataServiceUrl(), "/databases"))
                    .addHeader("Authorization", "Bearer " + event.getRootToken())
                    .post(body)
                    .build();

            Response response = httpClient.newCall(request).execute();
            if (!response.isSuccessful()) {
                log.warn("Создание БД: {}, потерпело неудачу. Код ответа: {}", dbName, response.code());

                throw new IllegalStateException();
            }

            log.info("БД: {} успешно создана", dbName);
            execution.setVariable(ITERATION_COUNTER_VAR_NAME, 3);
            response.close();
        } catch (Exception e) {
            if (currentIteration < 1) {
                log.error("Создание БД потерпело неудачу => {}", e.getMessage(), e);

                throw new BpmnError("dbCreationFailed");
            } else {
                execution.setVariable(ITERATION_COUNTER_VAR_NAME, --currentIteration);
                log.error("Создание БД потерпело неудачу => [{}] Попробуем еще раз.", e.getMessage(), e);

                throw new BpmnError("dbCreationFailedTryOneMore");
            }
        }
    }
}
