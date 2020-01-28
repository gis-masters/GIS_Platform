package ru.mycrg.gis_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.gis_service.entity.Layer;

@Projection(
        name = "layerProjection",
        types = { Layer.class })
public interface LayerProjection {

    Long getId();

    String getTitle();

    String getInternalName();

    Integer getOrder();

    String getGeometryType();

}
