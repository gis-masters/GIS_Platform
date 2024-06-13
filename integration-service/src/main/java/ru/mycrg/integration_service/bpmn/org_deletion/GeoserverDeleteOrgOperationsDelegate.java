package ru.mycrg.integration_service.bpmn.org_deletion;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;
import java.util.List;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service
public class GeoserverDeleteOrgOperationsDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverDeleteOrgOperationsDelegate.class);

    private final BaseHttpService baseHttpService;

    public GeoserverDeleteOrgOperationsDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Object orgId = execution.getVariable(ORG_ID_VAR_NAME);
        Object accessToken = execution.getVariable(TOKEN_VAR_NAME);
        List<String> geoserverLogins = (List<String>) execution.getVariable(USERS_VAR_NAME);

        String usersJson = objectMapper.writeValueAsString(geoserverLogins);

        Request request = new Request.Builder()
                .url(new URL(baseHttpService.getGisServiceUrl(), "/geoserver/organizations/" + orgId))
                .addHeader("Authorization", "Bearer " + accessToken)
                .delete(RequestBody.create(JSON_MEDIA_TYPE, usersJson))
                .build();

        Response response = httpClient.newCall(request).execute();
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
