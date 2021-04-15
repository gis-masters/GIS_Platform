package ru.mycrg.gis_service.entity;

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
    private String schemaId;

    @Column
    private String dataSourceUri;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    private Project project;

    @ManyToOne(cascade = CascadeType.ALL)
    private Group parent;

    public Layer() {
        // Required
    }

    public Layer(LayerCreateDto dto) {
        title = dto.getTitle();
        dataset = dto.getDataset();
        tableName = dto.getTableName();
        type = dto.getType();
        schemaId = dto.getSchemaId();
        styleName = dto.getStyleName();
        dataStoreName = dto.getDataStoreName();
        nativeCRS = dto.getNativeCRS();
        dataSourceUri = dto.getDataSourceUri();

        enabled = Boolean.parseBoolean(dto.getEnabled());
        position = dto.getPosition();
        transparency = dto.getTransparency();
        minZoom = dto.getMinZoom();
        maxZoom = dto.getMaxZoom();

        createdAt = LocalDateTime.now();
        lastModified = LocalDateTime.now();
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

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Layer layer = (Layer) o;
        return getId() == layer.getId() &&
                isEnabled() == layer.isEnabled() &&
                getPosition() == layer.getPosition() &&
                getTransparency() == layer.getTransparency() &&
                getMaxZoom() == layer.getMaxZoom() &&
                getMinZoom() == layer.getMinZoom() &&
                Objects.equals(getTitle(), layer.getTitle()) &&
                Objects.equals(getDataset(), layer.getDataset()) &&
                getTableName().equals(layer.getTableName()) &&
                getType().equals(layer.getType()) &&
                Objects.equals(getStyleName(), layer.getStyleName()) &&
                Objects.equals(getNativeCRS(), layer.getNativeCRS()) &&
                Objects.equals(getDataStoreName(), layer.getDataStoreName()) &&
                getSchemaId().equals(layer.getSchemaId()) &&
                Objects.equals(getDataSourceUri(), layer.getDataSourceUri());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle(), getDataset(), getTableName(), getType(), isEnabled(), getPosition(),
                            getTransparency(), getMaxZoom(), getMinZoom(), getStyleName(), getNativeCRS(),
                            getDataStoreName(), getSchemaId(), getDataSourceUri());
    }
}
