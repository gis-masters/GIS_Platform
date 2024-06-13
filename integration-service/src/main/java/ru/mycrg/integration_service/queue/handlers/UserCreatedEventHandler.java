package ru.mycrg.integration_service.queue.handlers;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.UserCreatedEvent;
import ru.mycrg.auth_service_contract.events.response.UserProvisioningFailedEvent;
import ru.mycrg.auth_service_contract.events.response.UserProvisioningSucceedEvent;
import ru.mycrg.geoserver_client.dto.UserGeoserverDto;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.queue.MessageBusProducer;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.net.URL;
import java.util.Objects;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;

@Service
public class UserCreatedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(UserCreatedEventHandler.class);

    private final BaseHttpService baseHttpService;
    private final MessageBusProducer messageBus;

    public UserCreatedEventHandler(BaseHttpService baseHttpService,
                                   MessageBusProducer messageBus) {
        this.baseHttpService = baseHttpService;
        this.messageBus = messageBus;
    }

    @Override
    public String getEventType() {
        return UserCreatedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        UserCreatedEvent event = (UserCreatedEvent) mqEvent;
        UserGeoserverDto userDto = new UserGeoserverDto(event.getGeoserverLogin(),
                                                        event.getLogin(),
                                                        event.getPassword(),
                                                        event.getRole());
        String token = event.getToken();

        try {
            log.debug("userCreatedEvent: {}", event);

            Request req = new Request.Builder()
                    .url(new URL(baseHttpService.getGisServiceUrl(), "/geoserver/users"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, objectMapper.writeValueAsString(userDto)))
                    .build();

            Response response = httpClient.newCall(req).execute();
            if (response.isSuccessful()) {
                log.info("Создание пользователя на геосервере прошло успешно");

                messageBus.produce(new UserProvisioningSucceedEvent(event));
            } else {
                String responseBody = Objects.requireNonNull(response.body()).string();
                log.error("Не удалось создать пользователя на геосервере. Ответ геосервера: '{}' Token: '{}'",
                          responseBody, token);

                messageBus.produce(new UserProvisioningFailedEvent(event));
            }

            response.close();
        } catch (Exception e) {
            log.error("Что-то пошло не так. Не удалось создать пользователя на геосервере: '{}' Token: '{}' ",
                      e.getMessage(), token);

            messageBus.produce(new UserProvisioningFailedEvent(event));
        }
    }
}
