package ru.mycrg.gis_service.entity;

import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.hateoas.Identifiable;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="projects")
public class Project implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @Column
    private String internalName;

    @Column
    private long organizationId;

    @Column
    private String bbox;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_modified")
    private @LastModifiedDate LocalDateTime lastModified;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project")
    private List<Layer> layers = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project")
    private List<Group> groups = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "projects_basemaps",
            joinColumns = {@JoinColumn(name = "project_id")},
            inverseJoinColumns = {@JoinColumn(name = "basemap_id")}
    )
    private Set<BaseMap> baseMaps = new HashSet<>();

    public Project() {}

    public Project(String name, long organizationId) {
        this.name = name;
        this.organizationId = organizationId;

        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getInternalName() {
        return internalName;
    }

    public void setInternalName(String internalName) {
        this.internalName = internalName;
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

}
