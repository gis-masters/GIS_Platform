package ru.mycrg.data_service.dto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.Permission;

import java.time.LocalDateTime;

@Projection(
        name = "aclPermissionProjection",
        types = { Permission.class })
public interface PermissionProjection {

    Long getId();

    @Value("#{target.principal.identifier}")
    Long getPrincipalId();

    @Value("#{target.principal.type}")
    String getPrincipalType();

    @Value("#{target.role.name}")
    String getRole();

    LocalDateTime getCreatedAt();
}
