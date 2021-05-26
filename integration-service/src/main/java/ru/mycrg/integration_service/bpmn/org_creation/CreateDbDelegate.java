package ru.mycrg.integration_service.bpmn.org_creation;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
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
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.IS_CREATED_VAR_NAME;

@Service
public class CreateDbDelegate implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateDbDelegate.class);

    private final BaseHttpService baseHttpService;

    public CreateDbDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object jsonString = execution.getVariable(EVENT_VAR_NAME);
        OrganizationInitializedEvent event =
                objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

        final String dbName = getDefaultDatabaseName(event.getOrgId());
        final RequestBody body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                "{\"name\":\"" + dbName + "\"}");

        Request request = new Request.Builder()
                .url(new URL(baseHttpService.getDataServiceUrl(), "/databases"))
                .addHeader("Authorization", "Bearer " + event.getToken())
                .post(body)
                .build();

        final Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            log.info("БД: {} успешно создана", dbName);
            execution.setVariable(IS_CREATED_VAR_NAME, true);
        } else {
            log.warn("Создание БД: {}, потерпело неудачу. Response code: {}", dbName, response.code());
            execution.setVariable(IS_CREATED_VAR_NAME, false);
        }

        response.close();
    }
}
