package ru.mycrg.gis_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.hateoas.Identifiable;
import ru.mycrg.gis_service.dto.GroupCreateDto;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "groups")
public class Group implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column
    private Long parentId;

    @Column
    private String title;

    @Column
    private String internalName;

    @Column
    private boolean enabled;

    @Column
    private boolean expanded;

    @Column
    private int position;

    @Column
    private int transparency;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

    @ManyToOne
    @JsonIgnore
    private Project project;

    public Group() {
        // Required
    }

    public Group(GroupCreateDto dto) {
        this.title = dto.getTitle();
        this.parentId = dto.getParentId();
        this.position = dto.getPosition();

        this.enabled = Boolean.parseBoolean(dto.getEnabled());
        this.expanded = Boolean.parseBoolean(dto.getExpanded());
        this.transparency = dto.getTransparency();
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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parent) {
        this.parentId = parent;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInternalName() {
        return internalName;
    }

    public void setInternalName(String internalName) {
        this.internalName = internalName;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Group group = (Group) o;
        return isEnabled() == group.isEnabled() &&
                isExpanded() == group.isExpanded() &&
                getPosition() == group.getPosition() &&
                getTransparency() == group.getTransparency() &&
                getId().equals(group.getId()) &&
                Objects.equals(getParentId(), group.getParentId()) &&
                getTitle().equals(group.getTitle()) &&
                getInternalName().equals(group.getInternalName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getParentId(), getTitle(), getInternalName(), isEnabled(), isExpanded(),
                            getPosition(),
                            getTransparency());
    }
}
