package ru.mycrg.integration_service.bpmn.user_deletion;

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
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("gisUserPermissionDeleteDelegate")
public class GisPermissionDeleteDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GisPermissionDeleteDelegate.class);

    private final BaseHttpService baseHttpService;

    public GisPermissionDeleteDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object userId = getVariable(execution, ENTITY_ID_VAR_NAME, getClass().getName());
        final String accessToken = getVariable(execution, TOKEN_VAR_NAME, getClass().getName()).toString();
        final String path = String.format("/projects/permissions/%s?principal_type=user", userId);

        Request req = new Request.Builder()
                .addHeader("Authorization", "Bearer " + accessToken)
                .url(new URL(baseHttpService.getGisServiceUrl(), path))
                .delete()
                .build();

        Response response = httpClient.newCall(req).execute();
        if (response.isSuccessful()) {
            log.info("Разрешения пользователя c id: {} были удалены на gis-service", userId);
        } else {
            log.warn("Разрешения пользователя c id: {} не были удалены на gis-service", userId);
        }

        response.close();
    }
}
