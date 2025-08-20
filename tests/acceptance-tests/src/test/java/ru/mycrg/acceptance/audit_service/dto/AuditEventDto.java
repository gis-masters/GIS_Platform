package ru.mycrg.acceptance.audit_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

public class AuditEventDto {

    private Long id;
    private String userName;
    private String eventDateTime;
    private String actionType;
    private String entityName;
    private String entityType;
    private Long entityId;

    @JsonIgnore
    private List<Long> entityIds;
    private Long organizationId;
    private JsonNode entityStateAfter;
    private Object _links;

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Object get_links() {
        return _links;
    }

    public void set_links(Object _links) {
        this._links = _links;
    }

    public List<Long> getEntityIds() {
        return entityIds;
    }

    public void setEntityIds(List<Long> entityIds) {
        this.entityIds = entityIds;
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
