package ru.mycrg.integration_service.bpmn.org_creation;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;

import java.net.MalformedURLException;
import java.net.URL;

import static java.lang.Thread.sleep;
import static ru.mycrg.integration_service.bpmn.BaseHttpDelegate.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("checkResultsDelegate")
public class CheckResultsDelegate implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CheckResultsDelegate.class);

    public static final int REPEAT_LIMIT = 4;
    public static final long WAIT_INTERVAL = 5_000L;

    public final URL camundaUrl = new URL("http://localhost:8338");

    public CheckResultsDelegate() throws MalformedURLException {
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String processId = (String) execution.getVariable(PROCESS_ID_VAR_NAME);
        int currentCounter = (int) execution.getVariable(COUNTER_VAR_NAME);
        if (currentCounter > REPEAT_LIMIT || processId == null) {
            execution.setVariable(CHECK_STATUS_VAR_NAME, "FAILED");
        } else {
            log.debug("CheckResultsDelegate: {}, currentCounter: {}", processId, currentCounter);

            sleep(WAIT_INTERVAL * currentCounter);

            Request request = new Request.Builder()
                    .url(new URL(camundaUrl, "/engine-rest/history/process-instance/" + processId))
                    .get()
                    .build();

            final Response response = httpClient.newCall(request).execute();
            if (response.isSuccessful()) {
                if (response.body() != null) {
                    final String responseJson = response.body().string();

                    if (responseJson.contains("\"state\":\"COMPLETED\"")) {
                        execution.setVariable(CHECK_STATUS_VAR_NAME, "SUCCESS");
                    } else {
                        execution.setVariable(CHECK_STATUS_VAR_NAME, "REPEAT");
                        execution.setVariable(COUNTER_VAR_NAME, currentCounter + 1);
                    }
                } else {
                    execution.setVariable(CHECK_STATUS_VAR_NAME, "FAILED");
                }
            } else {
                final Object jsonString = execution.getVariable(EVENT_VAR_NAME);
                OrganizationInitializedEvent event =
                        objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

                execution.setVariable(CHECK_STATUS_VAR_NAME, "FAILED");
                execution.setVariable(ORG_ID_VAR_NAME, event.getOrgId());
            }

            response.close();
        }
    }
}
