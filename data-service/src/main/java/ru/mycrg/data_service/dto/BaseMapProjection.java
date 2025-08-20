package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.BaseMap;

import java.time.LocalDateTime;

@Projection(
        name = "baseMapProjection",
        types = {BaseMap.class})
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface BaseMapProjection {

    Long getId();

    String getName();

    String getTitle();

    String getThumbnailUrn();

    String getType();

    String getUrl();

    String getLayerName();

    String getStyle();

    String getProjection();

    String getFormat();

    Integer getSize();

    Integer getResolution();

    Integer getMatrixIds();

    LocalDateTime getCreatedAt();

    Boolean getPluggableToNewProject();

    Integer getPosition();
}
