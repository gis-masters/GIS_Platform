package ru.mycrg.data_service.dto.kpt_import;

import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Запрос на импорт КПТ из xml файла, расположенного на жестком диске
 */
public class KptImportXmlRequest {

    /**
     * Идентификатор документа КПТ
     */
    @NotNull
    private Long documentId;
    /**
     * Названия таблиц для импорта
     */
    @NotEmpty
    private List<String> tableNames;
    /**
     * Идентификатор проекта
     */
    @NotNull
    private Long projectId;
    /**
     * Настройки валидации импортируемых данных
     */
    private KptImportValidationSettings validationSettings;

    public long getFileId() {
        return documentId;
    }

    public List<String> getTableNames() {
        return tableNames;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setDocumentId(long documentId) {
        this.documentId = documentId;
    }

    public void setTableNames(List<String> tableNames) {
        this.tableNames = tableNames;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }

    public KptImportValidationSettings getValidationSettings() {
        return validationSettings;
    }

    public void setValidationSettings(KptImportValidationSettings validationSettings) {
        this.validationSettings = validationSettings;
    }
}
