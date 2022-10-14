package ru.mycrg.data_service.dto;

import org.hibernate.validator.constraints.Length;
import ru.mycrg.data_service.validators.ValidateEnum;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

public class BaseMapUpdateDto {

    @Length(max = 255)
    private String name;

    @Length(min = 3, max = 255)
    private String title;

    @Length(min = 3, max = 255)
    private String thumbnailUrn;

    @ValidateEnum(targetClassType = SourceType.class,
                  message = "Please provide correct ENUM value: OSM, XYZ, WMTS, WMTS_P")
    private String type;

    @Length(max = 255)
    private String url;

    @Length(max = 255)
    private String layerName;

    @Length(max = 50)
    private String style;

    @Length(max = 20)
    private String projection;

    @Length(max = 20)
    private String format;

    @Min(1)
    @Max(Integer.MAX_VALUE)
    private Integer size;

    @Min(1)
    @Max(Integer.MAX_VALUE)
    private Integer resolution;

    @Min(1)
    @Max(Integer.MAX_VALUE)
    private Integer matrixIds;

    private Integer position;

    private Boolean pluggableToNewProject;

    public BaseMapUpdateDto() {
        // Required
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThumbnailUrn() {
        return thumbnailUrn;
    }

    public void setThumbnailUrn(String thumbnailUrn) {
        this.thumbnailUrn = thumbnailUrn;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getProjection() {
        return projection;
    }

    public void setProjection(String projection) {
        this.projection = projection;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getResolution() {
        return resolution;
    }

    public void setResolution(Integer resolution) {
        this.resolution = resolution;
    }

    public Integer getMatrixIds() {
        return matrixIds;
    }

    public void setMatrixIds(Integer matrixIds) {
        this.matrixIds = matrixIds;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Boolean getPluggableToNewProject() {
        return pluggableToNewProject;
    }

    public void setPluggableToNewProject(Boolean pluggableToNewProject) {
        this.pluggableToNewProject = pluggableToNewProject;
    }
}
