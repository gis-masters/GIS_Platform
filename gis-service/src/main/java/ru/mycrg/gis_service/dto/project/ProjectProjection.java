package ru.mycrg.gis_service.dto.project;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.gis_service.entity.Project;

import java.time.LocalDateTime;

@Projection(
        name = "projectProjection",
        types = {Project.class})
public interface ProjectProjection {

    Long getId();

    String getName();

    String getDescription();

    long getOrganizationId();

    String getBbox();

    boolean isDefault();

    boolean isFolder();

    LocalDateTime getCreatedAt();
}
