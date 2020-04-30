package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.Permission;

@Projection(
        name = "permissionWithoutResourceProjection",
        types = { Permission.class })
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface PermissionWithoutResourceProjection {

    Long getId();

    Long getPrincipalId();

    String getPrincipalType();

    String getRole();

}
