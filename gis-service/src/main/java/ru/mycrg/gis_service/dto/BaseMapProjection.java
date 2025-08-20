package ru.mycrg.gis_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.gis_service.entity.BaseMap;

@Projection(
        name = "baseMapProjection",
        types = { BaseMap.class })
public interface BaseMapProjection {

    Long getId();

    Long getBaseMapId();

    String getTitle();

    Integer getPosition();

}
