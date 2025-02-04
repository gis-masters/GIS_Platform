package ru.mycrg.auth_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.User;

import java.time.LocalDateTime;
import java.util.Set;

@Projection(
        name = "commonUser",
        types = {User.class})
public interface UserProjection {

    Long getId();

    String getName();

    String getLogin();

    String getSurname();

    String getMiddleName();

    String getJob();

    String getPhone();

    String getEmail();

    String getDepartment();

    boolean isEnabled();

    Set<AuthorityProjection> getAuthorities();

    LocalDateTime getCreatedAt();

    String getGeoserverLogin();

    Integer getBossId();

    String getCreatedBy();

    String getUpdatedBy();
}
