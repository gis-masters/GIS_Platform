package ru.mycrg.acceptance.data_service.dto;

public class BaseMapCreateDto {
    private String name;
    private String title;
    private String thumbnailUrn;
    private String type;
    private String url;
    private String layerName;
    private String style;
    private String projection;
    private String format;
    private Integer size;
    private Integer resolution;
    private Integer matrixIds;

    public BaseMapCreateDto(String name, String title, String thumbnailUrn, String type, String url,
                            String layerName, String style, String projection, String format, Integer size,
                            Integer resolution, Integer matrixIds) {
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
    }

    public BaseMapCreateDto(String name, String title, String thumbnailUrn, String type) {
        this.name = name;
        this.title = title;
        this.thumbnailUrn = thumbnailUrn;
        this.type = type;
    }

    public BaseMapCreateDto() {}

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getThumbnailUrn() {
        return thumbnailUrn;
    }

    public String getType() {
        return type;
    }

    public String getUrl() {
        return url;
    }

    public String getLayerName() {
        return layerName;
    }

    public String getStyle() {
        return style;
    }

    public String getProjection() {
        return projection;
    }

    public String getFormat() {
        return format;
    }

    public Integer getSize() {
        return size;
    }

    public Integer getResolution() {
        return resolution;
    }

    public Integer getMatrixIds() {
        return matrixIds;
    }
}
