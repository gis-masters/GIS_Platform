package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.Permission;

import java.time.LocalDateTime;
import java.util.Set;

@Projection(
        name = "permissionProjection",
        types = { Permission.class })
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface PermissionProjection {

    Long getId();

    String getPrincipalType();

    Long getPrincipalId();

    String getRole();

    Set<ResourceProjection> getResources();

    LocalDateTime getCreatedAt();

}
