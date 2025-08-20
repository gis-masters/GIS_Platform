package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

import static java.time.LocalDateTime.now;

@Entity
@Table(name = "files")
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class File {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column
    private Long size;

    @Column(length = 10)
    private String extension;

    @Column(length = 500)
    private String path;

    @Column(length = 130)
    private String contentType;

    @Column
    private String intents;

    @Column(length = 20)
    private String resourceType;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "json")
    private JsonNode resourceQualifier;

    @Column
    private byte[] ecp;

    @Column(length = 50)
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = now();

    public File() {
        // Required
    }

    public File(MultipartFile file, String intents, String path, String userLogin) {
        this.title = file.getOriginalFilename();
        this.size = file.getSize();
        this.extension = StringUtils.getFilenameExtension(this.title.toLowerCase());
        this.contentType = file.getContentType();
        this.intents = intents;
        this.path = path;
        this.createdBy = userLogin;
        this.createdAt = now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String entityType) {
        this.resourceType = entityType;
    }

    public JsonNode getResourceQualifier() {
        return resourceQualifier;
    }

    public void setResourceQualifier(JsonNode resourceQualifier) {
        this.resourceQualifier = resourceQualifier;
    }

    public String getIntents() {
        return intents;
    }

    public void setIntents(String intents) {
        this.intents = intents;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public byte[] getEcp() {
        return ecp;
    }

    public void setEcp(byte[] ecp) {
        this.ecp = ecp;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : id) + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"size\":" + (size == null ? "null" : "\"" + size + "\"") + ", " +
                "\"extension\":" + (extension == null ? "null" : "\"" + extension + "\"") + ", " +
                "\"path\":" + (path == null ? "null" : "\"" + path + "\"") + ", " +
                "\"contentType\":" + (contentType == null ? "null" : "\"" + contentType + "\"") + ", " +
                "\"intents\":" + (intents == null ? "null" : "\"" + intents + "\"") + ", " +
                "\"resourceType\":" + (resourceType == null ? "null" : "\"" + resourceType + "\"") + ", " +
                "\"resourceQualifier\":" + (resourceQualifier == null ? "null" : resourceQualifier) + ", " +
                "\"createdBy\":" + (createdBy == null ? "null" : "\"" + createdBy + "\"") + ", " +
                "\"createdAt\":" + (createdAt == null ? "null" : createdAt) +
                "}";
    }
}
