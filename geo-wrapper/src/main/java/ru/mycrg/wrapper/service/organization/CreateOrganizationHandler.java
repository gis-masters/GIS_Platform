package ru.mycrg.wrapper.service.organization;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionSucceededEvent;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.geoserver_client.AuthServiceInfo;
import ru.mycrg.geoserver_client.services.organization.IOrganization;
import ru.mycrg.geoserver_client.services.organization.OrganizationService;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.requests_handler.IOrganizationRequestHandler;

import java.net.URL;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

/**
 * Сервис обрабатывающий событие создания организации.
 */
@Service
public class CreateOrganizationHandler implements IOrganizationRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateOrganizationHandler.class);

    private final MqSender mqSender;
    private final CrgProperties properties;
    private final OAuthClient oAuthClient;
    private final OkHttpClient httpClient;
    private final IOrganization organizationService;

    public CreateOrganizationHandler(MqSender mqSender, CrgProperties properties) {
        this.mqSender = mqSender;
        this.properties = properties;

        organizationService = new OrganizationService();
        httpClient = new OkHttpClient();

        AuthServiceInfo authServiceInfo = AuthServiceInfo.builder().url(properties.getAuthServiceUrl())
                .clientId(properties.getClientId()).clientSecret(properties.getClientSecret()).build();

        oAuthClient = OAuthClient.builder().url(authServiceInfo.getUrl()).clientId(authServiceInfo.getClientId())
                .clientSecret(authServiceInfo.getClientSecret()).build();
    }

    @Override
    public void handle(IOrganizationEvent event) {
        try {
            OrganizationInitializedEvent mqEvent = (OrganizationInitializedEvent) event;

            organizationService.create(mqEvent);

            final JwtToken jwtToken = oAuthClient.getJwtToken(properties.getRootUserName(),
                    properties.getRootUserPassword());
            JSONObject payload = new JSONObject();
            payload.put("name", DEFAULT_DB_NAME + mqEvent.getOrgId());
            Request request = new Request.Builder().url(new URL(properties.getDataServiceUrl(), "/databases"))
                    .addHeader("Authorization", "Bearer " + jwtToken.getAccess_token())
                    .post(RequestBody.create(JSON_MEDIA_TYPE, payload.toString())).build();

            final Response response = httpClient.newCall(request).execute();

            log.debug("data-service response code: {}", response.code());
            if (response.isSuccessful()) {
                mqSender.sendOrgEvent(new OrganizationDependencyProvisionSucceededEvent(mqEvent));
            }
        } catch (Exception e) {
            log.error("Не удалось создать организацию на геосервере: ", e);

            mqSender.sendOrgEvent(new OrganizationDependencyProvisionFailedEvent(event));
        }
    }

}
