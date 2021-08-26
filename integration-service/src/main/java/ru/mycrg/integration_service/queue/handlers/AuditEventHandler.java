package ru.mycrg.integration_service.queue.handlers;

import dto.AuditEventDto;
import events.CrgAuditEvent;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.net.URL;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;

@Service
public class AuditEventHandler implements IEventHandler {

    public static final MediaType JSON_MEDIA_TYPE = MediaType.parse("application/json; charset=utf-8");

    private static final Logger log = LoggerFactory.getLogger(AuditEventHandler.class);

    private final BaseHttpService baseHttpService;

    public AuditEventHandler(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public String getEventType() {
        return "CrgAuditEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        Response response = null;
        try {
            CrgAuditEvent event = (CrgAuditEvent) mqEvent;

            String entityType = isNull(event.getEntityType())
                                ? null
                                : event.getEntityType().name();

            AuditEventDto auditEventDto = new AuditEventDto(event.getEventDateTime(),
                                                            event.getActionType().name(),
                                                            event.getEntityName(),
                                                            entityType,
                                                            event.getEntityId(),
                                                            event.getEntityStateAfter());

            Request req = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + event.getToken())
                    .url(new URL(baseHttpService.getAuditServiceUrl(), "/events"))
                    .post(RequestBody.create(JSON_MEDIA_TYPE, objectMapper.writeValueAsString(auditEventDto)))
                    .build();

            response = httpClient.newCall(req).execute();
            if (!response.isSuccessful()) {
                log.warn("Не удалось записать событие аудита: {}", auditEventDto);
            }
        } catch (Exception e) {
            log.error("Failed to process audit queue event: {} ", e.getMessage());
        } finally {
            if (nonNull(response)) {
                response.close();
            }
        }
    }
}
