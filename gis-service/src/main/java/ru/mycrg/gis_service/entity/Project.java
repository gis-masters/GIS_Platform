package ru.mycrg.gis_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.hateoas.Identifiable;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "projects")
public class Project implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private long organizationId;

    @Column
    private String bbox;

    @Column
    private boolean isDefault;

    @Column
    private String path;

    @Column
    private boolean isFolder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_modified")
    private @LastModifiedDate LocalDateTime lastModified;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project", orphanRemoval = true)
    private List<Layer> layers = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project", orphanRemoval = true)
    private List<Group> groups = new ArrayList<>();

    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project", orphanRemoval = true)
    private Set<Permission> permissions = new HashSet<>();

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name = "projects_basemaps",
            joinColumns = {@JoinColumn(name = "project_id")},
            inverseJoinColumns = {@JoinColumn(name = "basemap_id")}
    )
    private Set<BaseMap> baseMaps = new HashSet<>();

    public Project() {
        // Required
    }

    public Project(ProjectCreateDto dto, long organizationId) {
        this.name = dto.getName();
        this.description = dto.getDescription();
        this.bbox = dto.getBbox();
        this.isDefault = dto.isDefault();
        this.isFolder = dto.isFolder();
        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
        this.organizationId = organizationId;
    }

    @Override
    public Long getId() {
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

    public long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(long organizationId) {
        this.organizationId = organizationId;
    }

    public String getBbox() {
        return bbox;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
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

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public List<Layer> getLayers() {
        return layers;
    }

    public void setLayers(List<Layer> layers) {
        this.layers = layers;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    public void addLayer(Layer layer) {
        this.layers.add(layer);
    }

    public void addGroup(Group group) {
        this.groups.add(group);
    }

    public Set<BaseMap> getBaseMaps() {
        return baseMaps;
    }

    public void setBaseMaps(Set<BaseMap> baseMaps) {
        this.baseMaps = baseMaps;
    }

    public void addBaseMap(BaseMap baseMap) {
        this.baseMaps.add(baseMap);
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Nullable
    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean isFolder() {
        return isFolder;
    }

    public void setFolder(boolean folder) {
        isFolder = folder;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Project project = (Project) o;
        return getId() == project.getId() &&
                getOrganizationId() == project.getOrganizationId() &&
                isDefault() == project.isDefault() &&
                getName().equals(project.getName()) &&
                Objects.equals(getBbox(), project.getBbox());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getOrganizationId(), getBbox(), isDefault());
    }
}
