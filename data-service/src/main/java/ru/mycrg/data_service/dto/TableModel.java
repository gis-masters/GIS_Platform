package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Relation(collectionRelation = "tables")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TableModel extends ResourceModel implements IResourceModel {

    private String documentType;
    private String status;
    private Boolean isPublic;
    private String docTerminationDate;
    private String docApproveDate;
    private Long fias__id;
    private String fias__address;
    private String fias__oktmo;

    public TableModel() {
        super();
    }

    public TableModel(SchemasAndTables table) {
        this(table.getId(), table.getTitle(), table.getDetails(), TABLE.name(), table.getIdentifier(),
             table.getItemsCount(), table.getCrs(), table.getSchemaId(), table.getCreatedAt().toString(), null,
             table.getDocumentType(), table.getStatus(), table.getPublic(), table.getDocTerminationDate(),
             table.getDocApproveDate(), table.getFiasId(), table.getFiasAddress(), table.getFiasOktmo());
    }

    public TableModel(Map<String, Object> table) {
        this(Long.valueOf(String.valueOf(table.get("id"))),
             String.valueOf(table.get("title")),
             String.valueOf(table.get("details")),
             TABLE.name(),
             String.valueOf(table.get("identifier")),
             Integer.valueOf(String.valueOf(table.get("items_count"))),
             String.valueOf(table.get("crs")),
             String.valueOf(table.get("schema_id")),
             table.get("created_at").toString(),
             null, null, null,
             null, null, null,
             null, null, null);
    }

    public TableModel(SchemasAndTables table, String role) {
        this(table.getId(), table.getTitle(), table.getDetails(), TABLE.name(), table.getIdentifier(),
             table.getItemsCount(), table.getCrs(), table.getSchemaId(), table.getCreatedAt().toString(), role,
             table.getDocumentType(), table.getStatus(), table.getPublic(), table.getDocTerminationDate(),
             table.getDocApproveDate(), table.getFiasId(), table.getFiasAddress(), table.getFiasOktmo());
    }

    public TableModel(Long id, String title, String details, String type, String identifier, Integer itemsCount,
                      String crs, String schemaId, String createdAt, String role, String documentType,
                      String status, Boolean isPublic, LocalDateTime docTerminationDate, LocalDateTime docApproveDate,
                      Long fias__id, String fias__address, String fias__oktmo) {
        super(id, title, details, type, identifier, itemsCount, crs, schemaId, createdAt, role);

        String docTerminationDateStr = Objects.nonNull(docTerminationDate)
                ? docTerminationDate.toString()
                : null;
        String docApproveDateStr = Objects.nonNull(docApproveDate)
                ? docApproveDate.toString()
                : null;

        this.documentType = documentType;
        this.status = status;
        this.isPublic = isPublic;
        this.docTerminationDate = docTerminationDateStr;
        this.docApproveDate = docApproveDateStr;
        this.fias__id = fias__id;
        this.fias__address = fias__address;
        this.fias__oktmo = fias__oktmo;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public String getDocTerminationDate() {
        return docTerminationDate;
    }

    public void setDocTerminationDate(String docTerminationDate) {
        this.docTerminationDate = docTerminationDate;
    }

    public String getDocApproveDate() {
        return docApproveDate;
    }

    public void setDocApproveDate(String docApproveDate) {
        this.docApproveDate = docApproveDate;
    }

    public Long getFias__id() {
        return fias__id;
    }

    public void setFias__id(Long fias__id) {
        this.fias__id = fias__id;
    }

    public String getFias__address() {
        return fias__address;
    }

    public void setFias__address(String fias__address) {
        this.fias__address = fias__address;
    }

    public String getFias__oktmo() {
        return fias__oktmo;
    }

    public void setFias__oktmo(String fias__oktmo) {
        this.fias__oktmo = fias__oktmo;
    }
}
