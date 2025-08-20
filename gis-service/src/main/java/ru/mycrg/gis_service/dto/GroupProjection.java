package ru.mycrg.gis_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.gis_service.entity.Group;

@Projection(
        name = "groupProjection",
        types = { Group.class })
public interface GroupProjection {

    Long getId();

    String getTitle();

    String getInternalName();

    boolean isEnabled();

    boolean isExpanded();

    Integer getPosition();

    int getTransparency();

    Long getParentId();
}
