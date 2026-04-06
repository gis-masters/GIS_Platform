package ru.mycrg.common_contracts.generated.data_service;

import jakarta.validation.constraints.*;
import ru.mycrg.common_contracts.OnCreate;

public class BaseMapRequestModel {

    @NotBlank(groups = OnCreate.class)
    @Size(max = 255)
    private String name;

    @NotBlank(groups = OnCreate.class)
    @Size(min = 3, max = 255)
    private String title;

    @Size(min = 3, max = 255)
    @NotNull(groups = OnCreate.class)
    private String thumbnailUrn;

    @NotNull(groups = OnCreate.class)
    private BaseMapType type;

    @Size(max = 255)
    private String url;

    @Size(max = 255)
    private String layerName;

    @Size(max = 50)
    private String style;

    @Size(max = 20)
    private String projection;

    @Size(max = 20)
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

    public BaseMapRequestModel() {
    }

    public BaseMapRequestModel(String name, String title, String thumbnailUrn, BaseMapType type, String url,
                               String layerName,
                               String style, String projection, String format, Integer size, Integer resolution,
                               Integer matrixIds, Integer position, Boolean pluggableToNewProject) {
        this.name = name;
        this.title = title;
        this.thumbnailUrn = thumbnailUrn;
        this.type = type;
        this.url = url;
        this.layerName = layerName;
        this.style = style;
        this.projection = projection;
        this.format = format;
        this.size = size;
        this.resolution = resolution;
        this.matrixIds = matrixIds;
        this.position = position;
        this.pluggableToNewProject = pluggableToNewProject;
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

    public BaseMapType getType() {
        return type;
    }

    public void setType(BaseMapType type) {
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

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"thumbnailUrn\":" + (thumbnailUrn == null ? "null" : "\"" + thumbnailUrn + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"url\":" + (url == null ? "null" : "\"" + url + "\"") + ", " +
                "\"layerName\":" + (layerName == null ? "null" : "\"" + layerName + "\"") + ", " +
                "\"style\":" + (style == null ? "null" : "\"" + style + "\"") + ", " +
                "\"projection\":" + (projection == null ? "null" : "\"" + projection + "\"") + ", " +
                "\"format\":" + (format == null ? "null" : "\"" + format + "\"") + ", " +
                "\"size\":" + (size == null ? "null" : "\"" + size + "\"") + ", " +
                "\"resolution\":" + (resolution == null ? "null" : "\"" + resolution + "\"") + ", " +
                "\"matrixIds\":" + (matrixIds == null ? "null" : "\"" + matrixIds + "\"") + ", " +
                "\"position\":" + (position == null ? "null" : "\"" + position + "\"") + ", " +
                "\"pluggableToNewProject\":" + (pluggableToNewProject == null ? "null" : "\"" + pluggableToNewProject + "\"") +
                "}";
    }
}
