package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.IMPORT_KPT_TASK_QUEUE;

public class KptImportXmlRequestEvent extends DefaultMessageBusRequestEvent {

    /**
     * Список файлов для импорта
     */
    private List<ImportSourceFileDto> sourceFiles;
    /**
     * Название БД, куда должен быть выполнен импорт
     */
    private String dbName;
    /**
     * Схемы слоёв, которые необходимо загрузить
     */
    private List<SchemaDto> layerSchemas;
    private String initiatorLogin;
    /**
     * Идентификатор проекта
     */
    private long projectId;
    private long taskId;
    /**
     * Настройки валидации
     */
    private KptImportValidationSettings validationSettings;

    public KptImportXmlRequestEvent() {
        super();
    }

    public KptImportXmlRequestEvent(List<ImportSourceFileDto> sourceFiles,
                                    String dbName,
                                    List<SchemaDto> layerSchemas,
                                    String initiatorLogin,
                                    long projectId,
                                    long taskId,
                                    KptImportValidationSettings validationSettings) {
        super(UUID.randomUUID(), IMPORT_KPT_TASK_QUEUE);
        this.sourceFiles = sourceFiles;
        this.dbName = dbName;
        this.layerSchemas = layerSchemas;
        this.initiatorLogin = initiatorLogin;
        this.projectId = projectId;
        this.taskId = taskId;
        this.validationSettings = validationSettings;
    }

    public List<ImportSourceFileDto> getSourceFiles() {
        return sourceFiles;
    }

    public String getDbName() {
        return dbName;
    }

    public List<SchemaDto> getLayerSchemas() {
        return layerSchemas;
    }

    public String getInitiatorLogin() {
        return initiatorLogin;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setSourceFiles(List<ImportSourceFileDto> sourceFiles) {
        this.sourceFiles = sourceFiles;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public void setLayerSchemas(List<SchemaDto> layerSchemas) {
        this.layerSchemas = layerSchemas;
    }

    public void setInitiatorLogin(String initiatorLogin) {
        this.initiatorLogin = initiatorLogin;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }

    public long getTaskId() {
        return taskId;
    }

    public void setTaskId(long taskId) {
        this.taskId = taskId;
    }

    public KptImportValidationSettings getValidationSettings() {
        return validationSettings;
    }

    public void setValidationSettings(KptImportValidationSettings validationSettings) {
        this.validationSettings = validationSettings;
    }
}
