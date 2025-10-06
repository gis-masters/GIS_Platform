package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_GEO_WRAPPER_QUEUE;

public class GpkgStartLoaderEvent extends DefaultMessageBusRequestEvent {

    private Long processId;
    private String dbName;
    private String login;
    private String token;
    private String filePath;
    private Long projectId;
    private String sourceTableName;
    private String sourceDataset;
    private String gdalCreatedSchema;

    public GpkgStartLoaderEvent() {
        super();
    }

    public GpkgStartLoaderEvent(Long processId,
                                String dbName,
                                String login,
                                String token,
                                String filePath,
                                Long projectId,
                                String sourceDataset) {
        super(UUID.randomUUID(), DATA_TO_GEO_WRAPPER_QUEUE);

        this.processId = processId;
        this.dbName = dbName;
        this.login = login;
        this.token = token;
        this.filePath = filePath;
        this.projectId = projectId;
        this.sourceDataset = sourceDataset;
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

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getSourceTableName() {
        return sourceTableName;
    }

    public void setSourceTableName(String sourceTableName) {
        this.sourceTableName = sourceTableName;
    }

    public String getSourceDataset() {
        return sourceDataset;
    }

    public void setSourceDataset(String sourceDataset) {
        this.sourceDataset = sourceDataset;
    }

    public String getGdalCreatedSchema() {
        return gdalCreatedSchema;
    }

    public void setGdalCreatedSchema(String gdalCreatedSchema) {
        this.gdalCreatedSchema = gdalCreatedSchema;
    }

    @Override
    public String toString() {
        return "{" +
                "\"processId\":" + (processId == null ? "null" : "\"" + processId + "\"") + ", " +
                "\"dbName\":" + (dbName == null ? "null" : "\"" + dbName + "\"") + ", " +
                "\"login\":" + (login == null ? "null" : "\"" + login + "\"") + ", " +
                "\"filePath\":" + (filePath == null ? "null" : "\"" + filePath + "\"") + ", " +
                "\"sourceDataset\":" + (sourceDataset == null ? "null" : "\"" + sourceDataset + "\"") + ", " +
                "\"sourceTableName\":" + (sourceTableName == null ? "null" : "\"" + sourceTableName + "\"") + ", " +
                "\"sourceSchemaName\":" + (gdalCreatedSchema == null ? "null" : "\"" + gdalCreatedSchema + "\"") + ", " +
                "}";
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
