package ru.mycrg.data_service.dto.kpt_import;

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
     * Названия схем слоёв для импорта
     */
    @NotEmpty
    private List<String> layersSchemasNames;
    /**
     * Идентификатор проекта
     */
    @NotNull
    private Long projectId;

    public long getFileId() {
        return documentId;
    }

    public List<String> getLayersSchemasNames() {
        return layersSchemasNames;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setDocumentId(long documentId) {
        this.documentId = documentId;
    }

    public void setLayersSchemasNames(List<String> layersSchemasNames) {
        this.layersSchemasNames = layersSchemasNames;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }
}
