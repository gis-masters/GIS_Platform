package ru.mycrg.integration_service.bpmn.org_creation;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service
public class RevertDeleteDbDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(RevertDeleteDbDelegate.class);

    private final BaseHttpService baseHttpService;

    public RevertDeleteDbDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        try {
            Object jsonString = getVariable(execution, EVENT_VAR_NAME, getClass().getName());
            OrganizationInitializedEvent event = objectMapper
                    .readValue((String) jsonString, OrganizationInitializedEvent.class);

            Long orgId = event.getOrgId();
            String accessToken = event.getRootToken();
            String dbName = getDefaultDatabaseName(orgId.toString());

            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getDataServiceUrl(), "/databases/" + dbName))
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .delete()
                    .build();

            Response response = httpClient.newCall(request).execute();
            if (response.isSuccessful()) {
                log.info("БД: {} успешно удалена", dbName);
            } else {
                log.warn("Удаление БД проекта: {}, потерпело неудачу", dbName);
            }

            response.close();
        } catch (Exception e) {
            log.error("Не удалось выполнить компенсационное действие - удаление БД => {}", e.getMessage(), e);
        }
    }
}
