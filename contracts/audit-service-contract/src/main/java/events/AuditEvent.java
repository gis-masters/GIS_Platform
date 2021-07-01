package events;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.time.LocalDateTime;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.AUDIT_REQUEST_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.AUDIT_REQUEST_KEY;

public class AuditEvent extends DefaultMessageBusRequestEvent {

    private String token;
    private LocalDateTime eventDateTime;
    private String actionType;
    private String entityName;
    private Long entityId;
    private String entityStateAfter;

    public AuditEvent() {
        super(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY);
    }

    public AuditEvent(String token, String actionType,
                      String entityName, Long entityId, String entityStateAfter) {
        super(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY);

        this.token = token;
        this.eventDateTime = LocalDateTime.now();
        this.actionType = actionType;
        this.entityName = entityName;
        this.entityId = entityId;
        this.entityStateAfter = entityStateAfter;
    }

    public AuditEvent(String token, String actionType) {
        super(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY);

        this.token = token;
        this.eventDateTime = LocalDateTime.now();
        this.actionType = actionType;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getEntityStateAfter() {
        return entityStateAfter;
    }

    public void setEntityStateAfter(String entityStateAfter) {
        this.entityStateAfter = entityStateAfter;
    }
}
