package ru.mycrg.integration_service.bpmn.org_creation;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service
public class GeoserverCreateOrgOperationsDelegate implements JavaDelegate {

    private final BaseHttpService baseHttpService;

    public GeoserverCreateOrgOperationsDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object jsonString = execution.getVariable(EVENT_VAR_NAME);
        OrganizationInitializedEvent event =
                objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

        final RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),
                (String) jsonString);

        Request request = new Request.Builder()
                .url(new URL(baseHttpService.getGisServiceUrl(), "/geoserver/organizations"))
                .addHeader("Authorization", "Bearer " + event.getToken())
                .post(body)
                .build();

        final Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful() && response.body() != null) {
            final String processId = response.body().string();

            execution.setVariable(PROCESS_ID_VAR_NAME, processId);
            execution.setVariable(COUNTER_VAR_NAME, 1);
        }

        response.close();
    }
}
