package ru.mycrg.auth_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.User;

import java.time.LocalDateTime;
import java.util.Set;

@Projection(
        name = "commonUser",
        types = { User.class })
public interface UserProjection {

    Long getId();

    String getName();

    String getUsername();

    String getSurName();

    String getEmail();

    boolean isEnabled();

    Set<AuthorityProjection> getAuthorities();

    LocalDateTime getCreatedAt();
}
