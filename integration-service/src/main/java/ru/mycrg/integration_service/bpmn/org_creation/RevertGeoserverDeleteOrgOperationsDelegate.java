package ru.mycrg.integration_service.bpmn.org_creation;

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
import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.IS_DELETED_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service
public class RevertGeoserverDeleteOrgOperationsDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(RevertGeoserverDeleteOrgOperationsDelegate.class);

    private final BaseHttpService baseHttpService;

    public RevertGeoserverDeleteOrgOperationsDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Object jsonString = getVariable(execution, EVENT_VAR_NAME, getClass().getName());
        OrganizationInitializedEvent event = objectMapper
                .readValue((String) jsonString, OrganizationInitializedEvent.class);

        Long orgId = event.getOrgId();
        String accessToken = event.getRootToken();
        List<String> geoserverLogins = new ArrayList<>();
        String login = event.getOwnerEmail() + "_" + orgId;

        log.debug("GeoserverDeleteOrgOperationsDelegate. OrgId: {} User: {}", orgId, login);

        geoserverLogins.add(login);

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE,
                                              objectMapper.writeValueAsString(geoserverLogins));

        Request request = new Request.Builder()
                .url(new URL(baseHttpService.getGisServiceUrl(), "/geoserver/organizations/" + orgId))
                .addHeader("Authorization", "Bearer " + accessToken)
                .delete(body)
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
