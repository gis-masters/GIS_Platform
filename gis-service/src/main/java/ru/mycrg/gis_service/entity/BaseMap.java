package ru.mycrg.gis_service.entity;

import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.hateoas.Identifiable;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "basemaps")
public class BaseMap implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(name = "basemap_id")
    private Long baseMapId;

    @Column
    private String title;

    @Column
    private int position;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

    @OneToMany
    @JoinTable(
            name = "projects_basemaps",
            joinColumns = {@JoinColumn(name = "basemap_id")},
            inverseJoinColumns = {@JoinColumn(name = "project_id")}
    )
    private Set<Project> projects = new HashSet<>();

    public BaseMap() {
        // Required
    }

    public BaseMap(BaseMapCreateDto dto) {
        this.baseMapId = dto.getBaseMapId();
        this.title = dto.getTitle();
        this.position = dto.getPosition();

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

    public Long getBaseMapId() {
        return baseMapId;
    }

    public void setBaseMapId(Long baseMapId) {
        this.baseMapId = baseMapId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
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

    public Set<Project> getProjects() {
        return projects;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BaseMap baseMap = (BaseMap) o;
        return getId() == baseMap.getId() &&
                getPosition() == baseMap.getPosition() &&
                getBaseMapId().equals(baseMap.getBaseMapId()) &&
                Objects.equals(getTitle(), baseMap.getTitle());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getBaseMapId(), getTitle());
    }
}
