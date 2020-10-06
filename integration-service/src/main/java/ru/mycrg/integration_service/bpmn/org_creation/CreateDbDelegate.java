package ru.mycrg.integration_service.bpmn.org_creation;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;

import java.net.URL;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpDelegate.dataServiceUrl;
import static ru.mycrg.integration_service.bpmn.BaseHttpDelegate.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.IS_CREATED_VAR_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

@Service
public class CreateDbDelegate implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object jsonString = execution.getVariable(EVENT_VAR_NAME);
        OrganizationInitializedEvent event =
                objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

        final String dbName = DEFAULT_DB_NAME + event.getOrgId();
        final RequestBody body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                "{\"name\":\"" + dbName + "\"}");

        Request request = new Request.Builder()
                .url(new URL(dataServiceUrl, "/databases"))
                .addHeader("Authorization", "Bearer " + event.getToken())
                .post(body)
                .build();

        final Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            execution.setVariable(IS_CREATED_VAR_NAME, true);
        } else {
            execution.setVariable(IS_CREATED_VAR_NAME, false);
        }

        response.close();
    }
}
