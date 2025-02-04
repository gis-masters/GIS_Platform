package ru.mycrg.audit_service_contract.dto;

import com.fasterxml.jackson.databind.JsonNode;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class AuditEventDto {

    @Min(value = -1)
    private Long entityId;

    @NotNull
    private LocalDateTime eventDateTime;

    @NotBlank
    @Size(min = 3, max = 20)
    private String actionType;

    @Size(max = 700)
    private String entityName;

    @Size(min = 3, max = 50)
    private String entityType;

    private JsonNode entityStateAfter;

    private JsonNode entityIds;

    public AuditEventDto() {
        // Framework required
    }

    public AuditEventDto(LocalDateTime eventDateTime, String actionType) {
        this.eventDateTime = eventDateTime;
        this.actionType = actionType;
    }

    public AuditEventDto(LocalDateTime eventDateTime,
                         String actionType,
                         String entityName,
                         String entityType,
                         Long entityId,
                         JsonNode entityStateAfter,
                         JsonNode entityIds) {
        this(eventDateTime, actionType);

        this.entityName = entityName;
        this.entityType = entityType;
        this.entityId = entityId;
        this.entityStateAfter = entityStateAfter;
        this.entityIds = entityIds;
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

    @Override
    public String toString() {
        Object stateAfter = entityStateAfter == null ? "null" : entityStateAfter;

        return "{" +
                "\"eventDateTime\":" + (eventDateTime == null ? "null" : "\"" + eventDateTime + "\"") + ", " +
                "\"actionType\":" + (actionType == null ? "null" : "\"" + actionType + "\"") + ", " +
                "\"entityName\":" + (entityName == null ? "null" : "\"" + entityName + "\"") + ", " +
                "\"entityType\":" + (entityType == null ? "null" : "\"" + entityType + "\"") + ", " +
                "\"entityId\":" + (entityId == null ? "null" : "\"" + entityId + "\"") + ", " +
                "\"entityStateAfter\":" + stateAfter +
                "}";
    }
}
