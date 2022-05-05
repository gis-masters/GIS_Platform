package ru.mycrg.data_service.entity;

import org.springframework.data.annotation.LastModifiedDate;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.ResourceType;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "schemas_and_tables")
public class SchemasAndTables {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1024)
    private String details;

    @Column
    private boolean isFolder;

    @Column(updatable = false, nullable = false)
    private String identifier;

    @Column
    private String path;

    @Column
    private String crs;

    @Column
    private String schemaId;

    @Column(name = "items_count")
    private Integer itemsCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

    @Column(name = "fias__oktmo")
    private String fiasOktmo;

    @Column(name = "document_type")
    private String documentType;

    @Column(name = "doc_approve_date")
    private LocalDateTime docApproveDate;

    @Column(name = "scale")
    private Integer scale;

    @Column
    private String status;

    @Column(name = "is_public")
    private Boolean isPublic;

    @Column(name = "doc_termination_date")
    private LocalDateTime docTerminationDate;

    @Column(name = "fias__address")
    private String fiasAddress;

    @Column(name = "fias__id")
    private Long fiasId;

    public SchemasAndTables() {
        // Required by framework
    }

    public SchemasAndTables(ResourceType resourceType, ResourceCreateDto dto, String identifier, String path) {
        this.identifier = identifier;
        this.title = dto.getTitle();
        this.details = dto.getDetails();
        this.documentType = dto.getDocumentType();
        this.docApproveDate = Objects.nonNull(dto.getDocApproveDate())
                ? dto.getDocApproveDate().atStartOfDay()
                : null;
        this.fiasOktmo = dto.getOktmo();
        this.scale = dto.getScale();
        this.isFolder = resourceType.equals(ResourceType.DATASET);
        this.path = path;

        this.itemsCount = 0;
        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
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

    public boolean isFolder() {
        return isFolder;
    }

    public void setFolder(boolean folder) {
        isFolder = folder;
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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String pathTo() {
        return getPath() + "/" + getId();
    }

    public String getFiasOktmo() {
        return fiasOktmo;
    }

    public void setFiasOktmo(String oktmo) {
        this.fiasOktmo = oktmo;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public LocalDateTime getDocApproveDate() {
        return docApproveDate;
    }

    public void setDocApproveDate(LocalDateTime docApproveDate) {
        this.docApproveDate = docApproveDate;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public LocalDateTime getDocTerminationDate() {
        return docTerminationDate;
    }

    public void setDocTerminationDate(LocalDateTime docTerminationDate) {
        this.docTerminationDate = docTerminationDate;
    }

    public String getFiasAddress() {
        return fiasAddress;
    }

    public void setFiasAdress(String fiasAddress) {
        this.fiasAddress = fiasAddress;
    }

    public Long getFiasId() {
        return fiasId;
    }

    public void setFiasId(Long fiasId) {
        this.fiasId = fiasId;
    }
}
