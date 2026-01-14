package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class ImportGpkgEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private Long processId;
    private String dbName;
    private String token;
    private String creatorLogin;
    private UUID fileId;
    private Long projectId;
    private String targetDatasetIdentifier;
    private String targetDatasetTitle;
    private GpkgImportReport gpkgImportReport;

    public ImportGpkgEvent() {
        super();
    }

    public ImportGpkgEvent(Long processId,
                           String dbName,
                           String token,
                           String creatorLogin,
                           UUID fileId,
                           Long projectId,
                           String targetDatasetIdentifier,
                           String targetDatasetTitle,
                           GpkgImportReport gpkgImportReport) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.processId = processId;
        this.dbName = dbName;
        this.token = token;
        this.creatorLogin = creatorLogin;
        this.fileId = fileId;
        this.projectId = projectId;
        this.targetDatasetIdentifier = targetDatasetIdentifier;
        this.targetDatasetTitle = targetDatasetTitle;
        this.gpkgImportReport = gpkgImportReport;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCreatorLogin() {
        return creatorLogin;
    }

    public void setCreatorLogin(String creatorLogin) {
        this.creatorLogin = creatorLogin;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getTargetDatasetIdentifier() {
        return targetDatasetIdentifier;
    }

    public void setTargetDatasetIdentifier(String targetDatasetIdentifier) {
        this.targetDatasetIdentifier = targetDatasetIdentifier;
    }

    public String getTargetDatasetTitle() {
        return targetDatasetTitle;
    }

    public void setTargetDatasetTitle(String targetDatasetTitle) {
        this.targetDatasetTitle = targetDatasetTitle;
    }

    public GpkgImportReport getImportGpkgReport() {
        return gpkgImportReport;
    }

    public void setImportGpkgReport(GpkgImportReport gpkgImportReport) {
        this.gpkgImportReport = gpkgImportReport;
    }

    @Override
    public String toString() {
        return "{" +
                "\"processId\":" + (processId == null ? "null" : "\"" + processId + "\"") + ", " +
                "\"dbName\":" + (dbName == null ? "null" : "\"" + dbName + "\"") + ", " +
                "\"importGpkgReport\":" + (gpkgImportReport == null ? "null" : "\"" + gpkgImportReport + "\"") + ", " +
                "}";
    }
}
