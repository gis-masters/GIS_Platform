package events;

import com.fasterxml.jackson.databind.JsonNode;
import dto.AuditEventActionsType;
import dto.AuditEventEntityType;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.AUDIT_REQUEST_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.AUDIT_REQUEST_KEY;

public class CrgAuditEvent extends DefaultMessageBusRequestEvent {

    private String token;

    private LocalDateTime eventDateTime;

    private AuditEventActionsType actionType;

    private String entityName;

    private AuditEventEntityType entityType;

    private Long entityId;

    private JsonNode entityStateAfter;

    public CrgAuditEvent() {
        super(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY);
    }

    public CrgAuditEvent(String token, AuditEventActionsType actionType) {
        super(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY);

        this.token = token;
        this.eventDateTime = LocalDateTime.now(ZoneId.of("Europe/Moscow"));
        this.actionType = actionType;
    }

    public CrgAuditEvent(String token,
                         AuditEventActionsType actionType,
                         String entityName,
                         AuditEventEntityType entityType,
                         Long entityId) {
        this(token, actionType);

        this.entityName = entityName;
        this.entityType = entityType;
        this.entityId = entityId;
    }

    public CrgAuditEvent(String token,
                         AuditEventActionsType actionType,
                         String entityName,
                         AuditEventEntityType entityType,
                         Long entityId,
                         JsonNode entityStateAfter) {
        this(token, actionType, entityName, entityType, entityId);

        this.entityStateAfter = entityStateAfter;
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

    public AuditEventActionsType getActionType() {
        return actionType;
    }

    public void setActionType(AuditEventActionsType actionType) {
        this.actionType = actionType;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public AuditEventEntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(AuditEventEntityType entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public JsonNode getEntityStateAfter() {
        return entityStateAfter;
    }

    public void setEntityStateAfter(JsonNode entityStateAfter) {
        this.entityStateAfter = entityStateAfter;
    }
}
