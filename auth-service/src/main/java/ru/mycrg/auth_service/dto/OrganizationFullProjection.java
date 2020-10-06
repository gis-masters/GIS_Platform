package ru.mycrg.auth_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.Organization;

import java.time.LocalDateTime;
import java.util.Set;

@Projection(
        name = "fullOrganization",
        types = { Organization.class })
public interface OrganizationFullProjection {

    Long getId();

    String getName();

    String getPhone();

    String getStatus();

    Set<UserProjection> getUsers();

    Set<GroupProjection> getGroups();

    LocalDateTime getCreatedAt();

}
