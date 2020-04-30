package ru.mycrg.gis_service.dto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.gis_service.entity.Layer;

@Projection(
        name = "layerProjection",
        types = { Layer.class })
public interface LayerProjection {

    Long getId();

    String getTitle();

    String getInternalName();

    boolean isEnabled();

    Integer getPosition();

    int getTransparency();

    int getMaxZoom();

    int getMinZoom();

    String getNativeCRS();

    String getSchemaId();

    String getDataSourceUri();

    @Value("#{target.group != null ? target.group.id : null}")
    Long getGroupId();

}
