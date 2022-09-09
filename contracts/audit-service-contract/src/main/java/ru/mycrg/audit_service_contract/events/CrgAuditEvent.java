package ru.mycrg.audit_service_contract.events;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.AUDIT_REQUEST_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.AUDIT_REQUEST_KEY;

public class CrgAuditEvent extends DefaultMessageBusRequestEvent {

    private String token;
    private String dateTime;
    private String actionType;
    private String entityName;
    private String entityType;
    private Long entityId;
    private JsonNode entityStateAfter;
    private JsonNode entityIds;

    public CrgAuditEvent() {
        this(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY, null, null, null, null, null, null, null);
    }

    public CrgAuditEvent(String token, String actionType) {
        this(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY, token, actionType,
             null, null, null, null, null);
    }

    public CrgAuditEvent(String token, String actionType, String entityName, String entityType, Long entityId) {
        this(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY, token, actionType, entityName, entityType,
             entityId, null, null);
    }

    public CrgAuditEvent(JsonNode state, String aType, String name, String eType, Long id) {
        this(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY, null, aType, name, eType, id, state, null);
    }

    public CrgAuditEvent(String aType, String name, String eType, JsonNode entityIds) {
        this(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY, null, aType, name, eType, null, null,
             entityIds);
    }

    public CrgAuditEvent(JsonNode state, String aType, String name, String eType, JsonNode entityIds) {
        this(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY, null, aType, name, eType, null, state,
             entityIds);
    }

    public CrgAuditEvent(String token,
                         String actionType,
                         String entityName,
                         String entityType,
                         Long entityId,
                         JsonNode entityStateAfter) {
        this(UUID.randomUUID(), AUDIT_REQUEST_FANOUT, AUDIT_REQUEST_KEY, token, actionType, entityName, entityType,
             entityId, entityStateAfter, null);
    }

    private CrgAuditEvent(UUID id,
                          String exchange,
                          String routingKey,
                          String token,
                          String actionType,
                          String entityName,
                          String entityType,
                          Long entityId,
                          JsonNode entityStateAfter,
                          JsonNode entityIds) {
        super(id, exchange, routingKey);

        this.token = token;
        this.dateTime = LocalDateTime.now(ZoneId.of("Europe/Moscow")).toString();
        this.actionType = actionType;
        this.entityName = entityName;
        this.entityType = entityType;
        this.entityId = entityId;
        this.entityStateAfter = entityStateAfter;
        this.entityIds = entityIds;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String eventDateTime) {
        this.dateTime = eventDateTime;
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

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
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

    public JsonNode getEntityIds() {
        return entityIds;
    }

    public void setEntityIds(JsonNode entityIds) {
        this.entityIds = entityIds;
    }
}
