package ru.mycrg.gis_service.dto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.gis_service.entity.Permission;

@Projection(
        name = "permissionProjection",
        types = {Permission.class})
public interface PermissionProjection {

    Long getId();

    String getPrincipalType();

    Long getPrincipalId();

    @Value("#{target.role.name}")
    String getRole();
}
