package ru.mycrg.audit_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import ru.mycrg.audit_service_contract.dto.AuditEventDto;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_events")
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_date_time")
    private LocalDateTime eventDateTime;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "action_type")
    private String actionType;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "entity_state_after")
    @Type(type = "jsonb-node")
    private JsonNode entityStateAfter;

    @Column(name = "entity_ids")
    @Type(type = "jsonb-node")
    private JsonNode entityIds;

    public Event() {
        // Framework required
    }

    public Event(LocalDateTime eventDateTime, Long organizationId, String userName, String actionType) {
        this.eventDateTime = eventDateTime;
        this.organizationId = organizationId;
        this.userName = userName;
        this.actionType = actionType;
    }

    public Event(AuditEventDto auditEventDto, Long organizationId, String userName) {
        this(auditEventDto.getEventDateTime(), organizationId, userName, auditEventDto.getActionType());

        this.entityName = auditEventDto.getEntityName();
        this.entityType = auditEventDto.getEntityType();
        this.entityId = auditEventDto.getEntityId();
        this.entityStateAfter = auditEventDto.getEntityStateAfter();
        this.entityIds = auditEventDto.getEntityIds();
    }

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
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
