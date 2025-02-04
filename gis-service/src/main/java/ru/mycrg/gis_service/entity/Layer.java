package ru.mycrg.gis_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.hateoas.Identifiable;
import ru.mycrg.gis_service.dto.LayerCreateDto;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "layers")
public class Layer implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String title;

    @Column
    private String dataset;

    @Column
    private String tableName;

    @Column
    private String type;

    @Column
    private boolean enabled;

    @Column
    private int position;

    @Column
    private int transparency;

    @Column
    private int maxZoom;

    @Column
    private int minZoom;

    @Column
    private String styleName;

    @Column(name = "native_crs")
    private String nativeCRS;

    @Column
    private String dataStoreName;

    @Column
    private String dataSourceUri;

    @Column
    private String libraryId;

    @Column
    private Long recordId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Project project;

    @ManyToOne
    private Group parent;

    @Column(name = "content_type")
    private String contentType;

    @Column
    private String view;

    @Column
    private String errorText;

    @Column
    private String style;

    @Column
    private String photoMode;

    public Layer() {
        // Required
    }

    public Layer(LayerCreateDto dto) {
        title = dto.getTitle();
        dataset = dto.getDataset();
        tableName = dto.getTableName();
        type = dto.getType();
        styleName = dto.getStyleName();
        dataStoreName = dto.getDataStoreName();
        nativeCRS = dto.getNativeCRS() != null ? dto.getNativeCRS() : "EPSG:28406";
        dataSourceUri = dto.getDataSourceUri();
        libraryId = dto.getLibraryId();
        recordId = dto.getRecordId();

        enabled = Boolean.parseBoolean(dto.getEnabled());
        position = dto.getPosition();
        transparency = dto.getTransparency();
        minZoom = dto.getMinZoom();
        maxZoom = dto.getMaxZoom();

        createdAt = LocalDateTime.now();
        lastModified = LocalDateTime.now();
        contentType = dto.getContentType();
        view = dto.getView();
        errorText = dto.getErrorText();
        style = dto.getStyle();
        photoMode = dto.getPhotoMode();
    }

    public Layer(LayerCreateDto dto, Project project) {
        this(dto);

        this.project = project;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
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

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getTransparency() {
        return transparency;
    }

    public void setTransparency(int transparency) {
        this.transparency = transparency;
    }

    public int getMaxZoom() {
        return maxZoom;
    }

    public void setMaxZoom(int maxZoom) {
        this.maxZoom = maxZoom;
    }

    public int getMinZoom() {
        return minZoom;
    }

    public void setMinZoom(int minZoom) {
        this.minZoom = minZoom;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public void setNativeCRS(String nativeCRS) {
        this.nativeCRS = nativeCRS;
    }

    public String getDataStoreName() {
        return dataStoreName;
    }

    public void setDataStoreName(String dataStoreName) {
        this.dataStoreName = dataStoreName;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getDataSourceUri() {
        return dataSourceUri;
    }

    public void setDataSourceUri(String dataSourceUri) {
        this.dataSourceUri = dataSourceUri;
    }

    public Group getParent() {
        return parent;
    }

    public void setParent(Group group) {
        this.parent = group;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String datasets) {
        this.dataset = datasets;
    }

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getView() {
        return view;
    }

    public void setView(String view) {
        this.view = view;
    }

    public String getErrorText() {
        return errorText;
    }

    public void setErrorText(String healthCheck) {
        this.errorText = healthCheck;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getPhotoMode() {
        return photoMode;
    }

    public void setPhotoMode(String photoMode) {
        this.photoMode = photoMode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Layer)) {
            return false;
        }
        Layer layer = (Layer) o;

        return getId() == layer.getId() && getTitle().equals(layer.getTitle()) && getTableName().equals(
                layer.getTableName()) && getType().equals(layer.getType());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle(), getTableName(), getType());
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":\"" + id + "\"" + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"tableName\":" + (tableName == null ? "null" : "\"" + tableName + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"position\":\"" + position + "\"" + ", " +
                "\"transparency\":\"" + transparency + "\"" + ", " +
                "\"maxZoom\":\"" + maxZoom + "\"" + ", " +
                "\"minZoom\":\"" + minZoom + "\"" + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"dataStoreName\":" + (dataStoreName == null ? "null" : "\"" + dataStoreName + "\"") + ", " +
                "\"dataSourceUri\":" + (dataSourceUri == null ? "null" : "\"" + dataSourceUri + "\"") + ", " +
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"recordId\":" + (recordId == null ? "null" : "\"" + recordId + "\"") + ", " +
                "\"createdAt\":" + (createdAt == null ? "null" : createdAt) + ", " +
                "\"lastModified\":" + (lastModified == null ? "null" : lastModified) + ", " +
                "\"project\":" + (project == null ? "null" : project) + ", " +
                "\"parent\":" + (parent == null ? "null" : parent) + ", " +
                "\"contentType\":" + (contentType == null ? "null" : "\"" + contentType + "\"") + ", " +
                "\"view\":" + (view == null ? "null" : "\"" + view + "\"") + ", " +
                "\"errorText\":" + (errorText == null ? "null" : "\"" + errorText + "\"") + ", " +
                "\"style\":" + (style == null ? "null" : "\"" + style + "\"") + ", " +
                "\"photoMode\":" + (photoMode == null ? "null" : "\"" + photoMode + "\"") +
                "}";
    }
}
