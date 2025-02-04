package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.springframework.data.annotation.LastModifiedDate;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.TableCreateDto;

import javax.persistence.*;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.dto.ResourceType.DATASET;

@Entity
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
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

    @Column(length = 20)
    private String crs;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "jsonb")
    private JsonNode schema;

    @Column(name = "items_count")
    private Integer itemsCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt = now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = now();

    @Column(name = "document_type", length = 100)
    private String documentType;

    @Column(name = "doc_approve_date")
    private LocalDateTime docApproveDate;

    @Column(name = "scale")
    private Integer scale;

    @Column(length = 50)
    private String status;

    @Column(name = "is_public")
    private Boolean isPublic;

    @Column(name = "ready_for_fts")
    private Boolean readyForFts;

    @Column(name = "doc_termination_date")
    private LocalDateTime docTerminationDate;

    @Column(name = "fias__id")
    private Long fiasId;

    @Column(name = "fias__oktmo")
    private String fiasOktmo;

    @Column(name = "fias__address")
    private String fiasAddress;


    @Column(name = "gisogd_rf_publication_order")
    private Integer gisogdRfPublicationOrder;

    public SchemasAndTables() {
        // Required by framework
    }

    public SchemasAndTables(ResourceType type, ResourceCreateDto dto, String identifier, String path) {
        this(dto.getTitle(), dto.getDetails(), type.equals(DATASET), identifier, path, null, null, 0, now(), now(),
             dto.getOktmo(), dto.getDocumentType(),
             dto.getDocApproveDate() != null ? dto.getDocApproveDate().atStartOfDay() : null, dto.getScale(),
             null, null, null, null, null, null, null);
    }

    public SchemasAndTables(TableCreateDto dto, String path, ResourceType type, JsonNode schema) {
        this(dto.getTitle(), dto.getDetails(), type.equals(DATASET), dto.getName(), path, dto.getCrs(),
             schema, 0, now(), now(), dto.getFias__oktmo(), dto.getDocumentType(),
             dto.getDocApproveDate() != null ? dto.getDocApproveDate().atStartOfDay() : null, dto.getScale(),
             dto.getStatus(), dto.getIsPublic(), dto.getReadyForFts(),
             dto.getDocTerminationDate() != null ? dto.getDocTerminationDate().atStartOfDay() : null,
             dto.getFias__address(), dto.getFias__id(), null);
    }

    public SchemasAndTables(String title, String details, boolean isFolder, String identifier, String path,
                            String crs, JsonNode schema, Integer itemsCount, LocalDateTime createdAt,
                            LocalDateTime lastModified, String fiasOktmo, String documentType,
                            LocalDateTime docApproveDate, Integer scale, String status, Boolean isPublic,
                            Boolean readyForFts, LocalDateTime docTerminationDate, String fiasAddress, Long fiasId,
                            Integer gisogdRfPublicationOrder) {
        this.title = title;
        this.details = details;
        this.isFolder = isFolder;
        this.identifier = identifier;
        this.path = path;
        this.crs = crs;
        this.itemsCount = itemsCount;
        this.createdAt = createdAt;
        this.lastModified = lastModified;
        this.fiasOktmo = fiasOktmo;
        this.documentType = documentType;
        this.docApproveDate = docApproveDate;
        this.scale = scale;
        this.status = status;
        this.isPublic = isPublic;
        this.readyForFts = readyForFts;
        this.docTerminationDate = docTerminationDate;
        this.fiasAddress = fiasAddress;
        this.fiasId = fiasId;
        this.gisogdRfPublicationOrder = gisogdRfPublicationOrder;
        this.schema = schema;
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

    public Integer getGisogdRfPublicationOrder() {
        return gisogdRfPublicationOrder;
    }

    public void setGisogdRfPublicationOrder(Integer gisogdRfPublicationOrder) {
        this.gisogdRfPublicationOrder = gisogdRfPublicationOrder;
    }

    public Boolean getReadyForFts() {
        return readyForFts;
    }

    public void setReadyForFts(Boolean readyForFts) {
        this.readyForFts = readyForFts;
    }

    public JsonNode getSchema() {
        return schema;
    }

    public void setSchema(JsonNode schema) {
        this.schema = schema;
    }
}
