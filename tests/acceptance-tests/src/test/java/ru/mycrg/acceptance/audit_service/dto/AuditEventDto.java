package ru.mycrg.acceptance.audit_service.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class AuditEventDto {

    private String eventDateTime;
    private String actionType;
    private String entityName;
    private String entityType;
    private Long entityId;
    private JsonNode entityStateAfter;

    public AuditEventDto() {
        // Framework required
    }

    public AuditEventDto(String eventDateTime, String actionType) {
        this.eventDateTime = eventDateTime;
        this.actionType = actionType;
    }

    public AuditEventDto(String eventDateTime,
                         String actionType,
                         String entityName,
                         String entityType,
                         Long entityId,
                         JsonNode entityStateAfter) {
        this(eventDateTime, actionType);

        this.entityName = entityName;
        this.entityType = entityType;
        this.entityId = entityId;
        this.entityStateAfter = entityStateAfter;
    }

    public String getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(String eventDateTime) {
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

    @Override
    public String toString() {
        return "{" +
                "eventDateTime=" + eventDateTime +
                ", actionType='" + actionType + '\'' +
                ", entityName='" + entityName + '\'' +
                ", entityType='" + entityType + '\'' +
                ", entityId=" + entityId +
                ", entityStateAfter=" + entityStateAfter +
                '}';
    }
}
