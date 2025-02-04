package ru.mycrg.integration_service.bpmn.group_permission_deletion;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;

import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.ENTITY_ID_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;

@Service("gisGroupPermissionDeleteDelegate")
public class GisGroupPermissionDeleteDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GisGroupPermissionDeleteDelegate.class);

    private final BaseHttpService baseHttpService;

    public GisGroupPermissionDeleteDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object groupId = execution.getVariable(ENTITY_ID_VAR_NAME);
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        final String path = String.format("/projects/permissions/%s?principal_type=group", groupId);

        Request req = new Request.Builder()
                .addHeader("Authorization", "Bearer " + accessToken)
                .url(new URL(baseHttpService.getGisServiceUrl(), path))
                .delete()
                .build();

        Response response = httpClient.newCall(req).execute();
        if (response.isSuccessful()) {
            log.info("Разрешения групп пользователей c id: {} были удалены на gis-service", groupId);
        } else {
            log.warn("Разрешения групп пользователей c id: {} не были удалены на gis-service", groupId);
        }

        response.close();
    }
}
