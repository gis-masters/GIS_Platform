package ru.mycrg.auth_service.dto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.Organization;

import java.time.LocalDateTime;
import java.util.Set;

@Projection(
        name = "commonOrganization",
        types = { Organization.class })
public interface OrganizationProjection {

    Long getId();

    String getName();

    String getPhone();

    String getStatus();

    @Value("#{target.getUsers().size()}")
    int getUsersCount();

    Set<GroupProjection> getGroups();

    LocalDateTime getCreatedAt();

}
