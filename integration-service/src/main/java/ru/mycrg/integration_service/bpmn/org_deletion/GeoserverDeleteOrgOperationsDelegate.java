package ru.mycrg.integration_service.bpmn.org_deletion;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.List;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;

import static ru.mycrg.integration_service.bpmn.BaseHttpDelegate.gisServiceUrl;
import static ru.mycrg.integration_service.bpmn.BaseHttpDelegate.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service
public class GeoserverDeleteOrgOperationsDelegate implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(GeoserverDeleteOrgOperationsDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object orgId = execution.getVariable(ORG_ID_VAR_NAME);
        final Object accessToken = execution.getVariable(TOKEN_VAR_NAME);
        List<String> users = (List<String>) execution.getVariable(USERS_VAR_NAME);

        final String usersJson = objectMapper.writeValueAsString(users);

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                usersJson);

        Request request = new Request.Builder()
                .url(new URL(gisServiceUrl, "/geoserver/organizations/" + orgId))
                .addHeader("Authorization", "Bearer " + accessToken)
                .delete(body)
                .build();

        final Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            log.info("Удаление с геосервера организации: {} выполнено успешно", orgId);
            execution.setVariable(IS_DELETED_VAR_NAME, true);
        } else {
            log.warn("Удаление с геосервера потрахов организации: {}, потерпело неудачу", orgId);
            execution.setVariable(IS_DELETED_VAR_NAME, false);
        }

        response.close();
    }
}
