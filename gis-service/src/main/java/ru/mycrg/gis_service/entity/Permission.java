package ru.mycrg.gis_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.LastModifiedDate;
import ru.mycrg.gis_service.dto.PermissionCreateDto;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

import static java.time.LocalDateTime.*;

@Entity
@Table(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column
    private String principalType;

    @Column
    private Long principalId;

    @ManyToOne
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Project project;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified;

    public Permission() {
        // Required
    }

    public Permission(String principalType, Long principalId, Role role, Project project) {
        this.principalType = principalType;
        this.principalId = principalId;
        this.role = role;
        this.project = project;

        this.createdAt = now();
        this.lastModified = now();
    }

    public Permission(PermissionCreateDto dto, Project project) {
        this.principalId = dto.getPrincipalId();
        this.principalType = dto.getPrincipalType();
        this.project = project;

        this.createdAt = now();
        this.lastModified = now();
    }

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPrincipalType() {
        return principalType;
    }

    public void setPrincipalType(String principalType) {
        this.principalType = principalType;
    }

    public Long getPrincipalId() {
        return principalId;
    }

    public void setPrincipalId(Long principalId) {
        this.principalId = principalId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Permission that = (Permission) o;
        return getId().equals(that.getId()) &&
                getPrincipalType().equals(that.getPrincipalType()) &&
                getPrincipalId().equals(that.getPrincipalId()) &&
                getRole().equals(that.getRole());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getPrincipalType(), getPrincipalId(), getRole());
    }

    @Override
    public String toString() {
        return "{id=" + id +
                ", principalType='" + principalType + '\'' +
                ", principalId=" + principalId +
                ", role='" + role.getName() + '\'' +
                ", project=" + project.getId() +
                ", createdAt=" + createdAt +
                ", lastModified=" + lastModified +
                '}';
    }
}
