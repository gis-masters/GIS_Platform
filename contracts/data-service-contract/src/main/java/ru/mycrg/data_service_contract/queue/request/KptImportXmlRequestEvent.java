package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.List;
import java.util.Map;
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
     * Таблицы, в которые будет выполнен импорт. Key=Название таблицы, value=схема таблицы
     */
    private Map<String, SchemaDto> tables;
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
                                    Map<String, SchemaDto> tables,
                                    String initiatorLogin,
                                    long projectId,
                                    long taskId,
                                    KptImportValidationSettings validationSettings) {
        super(UUID.randomUUID(), IMPORT_KPT_TASK_QUEUE);
        this.sourceFiles = sourceFiles;
        this.dbName = dbName;
        this.tables = tables;
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

    public Map<String, SchemaDto> getTables() {
        return tables;
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

    public void setTables(Map<String, SchemaDto> tables) {
        this.tables = tables;
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
