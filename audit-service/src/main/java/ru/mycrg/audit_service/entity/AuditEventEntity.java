package ru.mycrg.audit_service.entity;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "audit_events")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class AuditEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_date_time")
    private Timestamp eventDateTime;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "action_type")
    private String actionType;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "entity_state_after")
    @Type(type = "jsonb")
    private String entityStateAfter;

    public AuditEventEntity() {
    }

    public AuditEventEntity(Long organizationId, String userName, String actionType, String entityName,
                            Long entityId, String entityStateAfter) {
        this.eventDateTime = new Timestamp(System.currentTimeMillis());
        this.organizationId = organizationId;
        this.userName = userName;
        this.actionType = actionType;
        this.entityName = entityName;
        this.entityId = entityId;
        this.entityStateAfter = entityStateAfter;
    }

    public Timestamp getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(Timestamp eventDateTime) {
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
