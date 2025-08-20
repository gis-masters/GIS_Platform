package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.import_.ImportKptTableDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.IMPORT_KPT_TASK_QUEUE;

public class ImportKptEvent extends DefaultMessageBusRequestEvent {

    private String dbName;

    /**
     * Список файлов для импорта
     */
    private List<ImportSourceFileDto> sourceFiles;

    /**
     * Таблицы, в которые будет выполнен импорт.
     */
    private List<ImportKptTableDto> tables;

    private String initiatorLogin;
    private long taskId;
    private long userIdAssignedToTask;

    /**
     * Настройки валидации
     */
    private KptImportValidationSettings validationSettings;

    public ImportKptEvent() {
        super();
    }

    public ImportKptEvent(List<ImportSourceFileDto> sourceFiles,
                          String dbName,
                          List<ImportKptTableDto> tables,
                          String initiatorLogin,
                          long taskId,
                          long userIdAssignedToTask,
                          KptImportValidationSettings validationSettings) {
        super(UUID.randomUUID(), IMPORT_KPT_TASK_QUEUE);

        this.sourceFiles = sourceFiles;
        this.dbName = dbName;
        this.tables = tables;
        this.initiatorLogin = initiatorLogin;
        this.taskId = taskId;
        this.userIdAssignedToTask = userIdAssignedToTask;
        this.validationSettings = validationSettings;
    }

    public List<ImportSourceFileDto> getSourceFiles() {
        return sourceFiles;
    }

    public String getDbName() {
        return dbName;
    }

    public List<ImportKptTableDto> getTables() {
        return tables;
    }

    public String getInitiatorLogin() {
        return initiatorLogin;
    }

    public void setSourceFiles(List<ImportSourceFileDto> sourceFiles) {
        this.sourceFiles = sourceFiles;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public void setTables(List<ImportKptTableDto> tables) {
        this.tables = tables;
    }

    public void setInitiatorLogin(String initiatorLogin) {
        this.initiatorLogin = initiatorLogin;
    }

    public long getTaskId() {
        return taskId;
    }

    public void setTaskId(long taskId) {
        this.taskId = taskId;
    }

    public long getUserIdAssignedToTask() {
        return userIdAssignedToTask;
    }

    public void setUserIdAssignedToTask(long userIdAssignedToTask) {
        this.userIdAssignedToTask = userIdAssignedToTask;
    }

    public KptImportValidationSettings getValidationSettings() {
        return validationSettings;
    }

    public void setValidationSettings(KptImportValidationSettings validationSettings) {
        this.validationSettings = validationSettings;
    }
}
