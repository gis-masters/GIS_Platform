package ru.mycrg.auth_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.OrganizationIntent;

@Projection(
        name = "intentProjection",
        types = {OrganizationIntent.class})
public interface IntentProjection {

    String getEmail();

    String getToken();

    Integer getSpecializationId();
}
