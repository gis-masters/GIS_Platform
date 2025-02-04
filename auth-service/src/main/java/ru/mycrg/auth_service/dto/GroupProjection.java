package ru.mycrg.auth_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.Group;

import java.time.LocalDateTime;
import java.util.Set;

@Projection(
        name = "commonGroup",
        types = { Group.class })
public interface GroupProjection {

    Long getId();

    String getName();

    String getDescription();

    Set<UserOnlyIdProjection> getUsers();

    LocalDateTime getCreatedAt();
}
