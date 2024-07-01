package ru.mycrg.data_service.dto.kpt_import;

import ru.mycrg.data_service_contract.dto.DatasetResourceQualifierDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class ImportKptRequest {

    @NotNull
    private Long documentId;

    @NotEmpty
    private List<DatasetResourceQualifierDto> tables;
    private KptImportValidationSettings validationSettings;

    public @NotNull Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(@NotNull Long documentId) {
        this.documentId = documentId;
    }

    public List<DatasetResourceQualifierDto> getTables() {
        return tables;
    }

    public void setTables(List<DatasetResourceQualifierDto> tables) {
        this.tables = tables;
    }

    public KptImportValidationSettings getValidationSettings() {
        return validationSettings;
    }

    public void setValidationSettings(KptImportValidationSettings validationSettings) {
        this.validationSettings = validationSettings;
    }
}
