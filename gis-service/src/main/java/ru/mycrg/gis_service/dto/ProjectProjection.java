package ru.mycrg.gis_service.dto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.gis_service.entity.Project;

import java.time.LocalDateTime;
import java.util.List;

@Projection(
        name = "projectProjection",
        types = { Project.class })
public interface ProjectProjection {

    Long getId();

    String getName();

    String getInternalName();

    long getOrganizationId();

    String getBbox();

    boolean isDefault();

    LocalDateTime getCreatedAt();

    @Value("#{target.layers.size()}")
    Long getLayersCount();

    List<BaseMapProjection> getBaseMaps();

}
