package ru.mycrg.integration_service.queue.handlers;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.audit_service_contract.dto.AuditEventDto;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.net.URL;
import java.time.LocalDateTime;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;

@Service
public class AuditEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(AuditEventHandler.class);

    private final BaseHttpService baseHttpService;

    public AuditEventHandler(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public String getEventType() {
        return CrgAuditEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        Response response = null;
        try {
            CrgAuditEvent event = (CrgAuditEvent) mqEvent;

            AuditEventDto auditEvent = prepareEvent(event);
            Request.Builder reqBuilder = new Request.Builder()
                    .url(new URL(baseHttpService.getAuditServiceUrl(), "/events"))
                    .post(RequestBody.create(JSON_MEDIA_TYPE, objectMapper.writeValueAsString(auditEvent)));

            if (event.getToken() != null) {
                reqBuilder.addHeader("Authorization", "Bearer " + event.getToken());
            }

            response = httpClient.newCall(reqBuilder.build()).execute();
            if (response.isSuccessful()) {
                log.debug("Success send audit event: {}", auditEvent);
            } else {
                log.warn("Не удалось записать событие аудита: {} => {} / {}",
                         auditEvent, response.code(), response.body().string());
            }
        } catch (Exception e) {
            log.error("Failed to process audit queue event: {} ", e.getMessage());
        } finally {
            if (nonNull(response)) {
                response.close();
            }
        }
    }

    @NotNull
    private static AuditEventDto prepareEvent(CrgAuditEvent event) {
        return new AuditEventDto(LocalDateTime.parse(event.getDateTime()),
                                 event.getActionType(),
                                 event.getEntityName(),
                                 isNull(event.getEntityType()) ? null : event.getEntityType(),
                                 event.getEntityId(),
                                 event.getEntityStateAfter(),
                                 event.getEntityIds());
    }
}
