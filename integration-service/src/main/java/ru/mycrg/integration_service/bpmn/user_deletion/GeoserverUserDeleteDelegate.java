package ru.mycrg.integration_service.bpmn.user_deletion;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.dto.UserGeoserverDto;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;
import java.util.Objects;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.USERS_VAR_NAME;

@Service("geoserverUserDeleteDelegate")
public class GeoserverUserDeleteDelegate implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(GeoserverUserDeleteDelegate.class);

    private final BaseHttpService baseHttpService;

    public GeoserverUserDeleteDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String login = execution.getVariable(USERS_VAR_NAME).toString();
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        final RequestBody body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                objectMapper.writeValueAsString(new UserGeoserverDto(login)));

        Request req = new Request.Builder()
                .url(new URL(baseHttpService.getGisServiceUrl(), "/geoserver/users"))
                .addHeader("Authorization", "Bearer " + accessToken)
                .delete(body)
                .build();

        Response response = httpClient.newCall(req).execute();
        if (response.isSuccessful()) {
            log.info("Удаление пользователя {} на геосервере было выполнено успешно", login);
        } else {
            String responseBody = Objects.requireNonNull(response.body()).string();
            log.error("Не удалось удалить пользователя на геосервере: {} ", responseBody);
        }
    }
}
