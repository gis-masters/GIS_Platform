package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Resource;

import java.time.LocalDateTime;
import java.util.Set;

@Projection(
        name = "resourceProjection",
        types = {Resource.class})
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface ResourceProjection {

    String getIdentifier();

    String getType();

    Set<PermissionProjection> getPermissions();

    LocalDateTime getCreatedAt();
}
