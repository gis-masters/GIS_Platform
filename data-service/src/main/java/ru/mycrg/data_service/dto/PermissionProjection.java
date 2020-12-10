package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.Permission;

import java.time.LocalDateTime;

@Projection(
        name = "permissionProjection",
        types = { Permission.class })
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface PermissionProjection {

    Long getId();

    @Value("#{target.principal.identifier}")
    Long getPrincipalId();

    @Value("#{target.principal.type}")
    String getPrincipalType();

    String getRole();

    LocalDateTime getCreatedAt();
}
