package dto;

import com.fasterxml.jackson.databind.JsonNode;
import dto.validator.ValueOfEnum;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class AuditEventDto {

    @NotNull
    private LocalDateTime eventDateTime;

    @NotBlank
    @Size(max = 20)
    @ValueOfEnum(enumClass = AuditEventActionsType.class)
    private String actionType;

    @Size(max = 100)
    private String entityName;

    @Min(value = 1)
    private Long entityId;

    private JsonNode entityStateAfter;

    public AuditEventDto() {
        // Framework required
    }

    public AuditEventDto(LocalDateTime eventDateTime, String actionType) {
        this.eventDateTime = eventDateTime;
        this.actionType = actionType;
    }

    public AuditEventDto(LocalDateTime eventDateTime, String actionType, String entityName, Long entityId,
                         JsonNode entityStateAfter) {
        this(eventDateTime, actionType);

        this.entityName = entityName;
        this.entityId = entityId;
        this.entityStateAfter = entityStateAfter;
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
                ", entityId=" + entityId +
                ", entityStateAfter=" + entityStateAfter +
                '}';
    }
}
