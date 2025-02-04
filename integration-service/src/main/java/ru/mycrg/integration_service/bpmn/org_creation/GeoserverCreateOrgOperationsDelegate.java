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

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service
public class GeoserverCreateOrgOperationsDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateOrgOperationsDelegate.class);

    private final BaseHttpService baseHttpService;

    public GeoserverCreateOrgOperationsDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        int currentIteration = (int) getVariable(execution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        log.error("Создание организации и владельца на геосервере, осталось попыток: [{}]",
                  currentIteration);

        try {
            Object jsonString = getVariable(execution, EVENT_VAR_NAME, getClass().getName());
            OrganizationInitializedEvent event =
                    objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getGisServiceUrl(), "/geoserver/organizations"))
                    .addHeader("Authorization", "Bearer " + event.getRootToken())
                    .post(RequestBody.create(JSON_MEDIA_TYPE, (String) jsonString))
                    .build();

            Response response = httpClient.newCall(request).execute();
            if (response.isSuccessful() && response.body() != null) {
                String processId = response.body().string();

                execution.setVariable(PROCESS_ID_VAR_NAME, processId);
                execution.setVariable(ITERATION_COUNTER_VAR_NAME, 1);
            }

            response.close();
        } catch (Exception e) {
            if (currentIteration < 1) {
                log.error("Создание организации на геосервере потерпело неудачу => {}", e.getMessage(), e);

                throw new BpmnError("geoserverCreateOrgFailed");
            } else {
                execution.setVariable(ITERATION_COUNTER_VAR_NAME, --currentIteration);
                log.error("Создание организации на геосервере потерпело неудачу => [{}] Попробуем еще раз.",
                          e.getMessage(), e);

                throw new BpmnError("geoserverCreateOrgFailedTryOneMore");
            }
        }
    }
}
