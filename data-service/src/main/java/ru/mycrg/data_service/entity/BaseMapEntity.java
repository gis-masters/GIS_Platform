package ru.mycrg.data_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.mycrg.data_service.dto.SourceType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseMapEntity {

    private long id;
    private String name;
    private String title;
    private String thumbnail;

    private SourceType type;
    private String url;
    private String layerName;
    private String style;
    private String projection;
    private String format;

    private Integer size;
    private Integer resolution;
    private Integer matrixIds;

}
