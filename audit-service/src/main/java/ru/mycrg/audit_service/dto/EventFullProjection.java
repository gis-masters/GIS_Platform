package ru.mycrg.audit_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.audit_service.entity.Event;
import tools.jackson.databind.JsonNode;

import java.time.LocalDateTime;

@Projection(name = "fullEvent",
            types = {Event.class})
public interface EventFullProjection {

    Long getId();

    LocalDateTime getEventDateTime();

    Long getOrganizationId();

    String getUserName();

    String getActionType();

    String getEntityName();

    String getEntityType();

    Long getEntityId();

    JsonNode getEntityStateAfter();

    JsonNode getEntityIds();
}
