package ru.mycrg.data_service.entity;

import org.hibernate.annotations.OnDelete;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.Authentication;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.ResourceType;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import static org.hibernate.annotations.OnDeleteAction.CASCADE;

@Entity
@Table(name = "resource")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1024)
    private String details;

    @Column(updatable = false, length = 20, nullable = false)
    private String type;

    @Column(updatable = false, nullable = false)
    private String identifier;

    @Column
    private String crs;

    @Column
    private String schemaId;

    @Column(name = "items_count")
    private Integer itemsCount;

    @Column
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

    @OneToMany(mappedBy = "resource")
    @OnDelete(action = CASCADE) // Поскольку таблицы создаются вручную, добавляю это сюда только чтобы отразить action
    private Set<Permission> permissions = new HashSet<>();

    public Resource() {
        // Required by framework
    }

    public Resource(ResourceType rType, ResourceCreateDto dto, String identifier, String createdBy) {
        this.title = dto.getTitle();
        this.details = dto.getDetails();
        this.type = rType.name();
        this.identifier = identifier;
        this.itemsCount = 0;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
    }

    public boolean isUserOwnMe(@NotNull String login) {
        return Objects.equals(this.createdBy, login);
    }

    public long getId() {
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

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public Integer getItemsCount() {
        return itemsCount;
    }

    public void setItemsCount(Integer itemsCount) {
        this.itemsCount = itemsCount;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createBy) {
        this.createdBy = createBy;
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

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }
}
