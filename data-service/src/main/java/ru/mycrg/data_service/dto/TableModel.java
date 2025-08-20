package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.Objects;

import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;

@Relation(collectionRelation = "tables")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TableModel extends ResourceModel implements IResourceModel {

    private String documentType;
    private String status;
    private Boolean isPublic;
    private Boolean readyForFts;
    private String docTerminationDate;
    private String docApproveDate;
    private String dataset;
    private Long fias__id;
    private String fias__address;
    private String fias__oktmo;

    public TableModel() {
        super();
    }

    public TableModel(SchemasAndTables table, String role, String dataset) {
        super(table.getId(), table.getTitle(), table.getDetails(), "TABLE", table.getIdentifier(),
              table.getItemsCount(), table.getCrs(), jsonToDto(table.getSchema()), table.getCreatedAt().toString(),
              role);

        String docTerminationDateStr = Objects.nonNull(table.getDocTerminationDate())
                ? table.getDocTerminationDate().toString()
                : null;
        String docApproveDateStr = Objects.nonNull(table.getDocApproveDate())
                ? table.getDocApproveDate().toString()
                : null;

        this.documentType = table.getDocumentType();
        this.status = table.getStatus();
        this.isPublic = table.getIsPublic();
        this.docTerminationDate = docTerminationDateStr;
        this.docApproveDate = docApproveDateStr;
        this.fias__id = table.getFiasId();
        this.fias__address = table.getFiasAddress();
        this.fias__oktmo = table.getFiasOktmo();
        this.readyForFts = table.getReadyForFts();
        this.dataset = dataset;
    }

    public TableModel(SchemasAndTables table, String dataset) {
        this(table, null, dataset);
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

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean aPublic) {
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

    public Boolean getReadyForFts() {
        return readyForFts;
    }

    public void setReadyForFts(Boolean readyForFts) {
        this.readyForFts = readyForFts;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }
}
