package ru.mycrg.data_service.entity;

import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@Entity
@Table(name = "base_maps")
public class BaseMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @Column
    private String title;

    @Column
    private String thumbnailUrn;

    @Column(length = 20)
    private String type;

    @Column
    private String url;

    @Column
    private String layerName;

    @Column(length = 50)
    private String style;

    @Column(length = 20)
    private String projection;

    @Column(length = 20)
    private String format;

    @Column
    private Integer size;

    @Column
    private Integer resolution;

    @Column
    private Integer matrixIds;

    @Column(name = "created_at")
    private LocalDateTime createdAt = now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = now();

    @Column(name = "pluggable_to_new_project")
    private Boolean pluggableToNewProject;

    @Column
    private Integer position;

    public BaseMap() {
        // Required
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public Boolean getPluggableToNewProject() {
        return pluggableToNewProject;
    }

    public void setPluggableToNewProject(Boolean pluggableInNewProject) {
        this.pluggableToNewProject = pluggableInNewProject;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}
