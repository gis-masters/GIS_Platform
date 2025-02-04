package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_GEO_WRAPPER_QUEUE;

public class ShapeLoadedEvent extends DefaultMessageBusRequestEvent {

    private Long processId;
    private String dbName;
    private String login;
    private String filePath;
    private String srs;
    private String targetTableName;
    private String datasetId;
    private String sourceTableName;
    private String geometryType;

    public ShapeLoadedEvent() {
        super();
    }

    public ShapeLoadedEvent(Long processId, String dbName, String login, String filePath, String srs,
                            String targetTableName, String datasetId, String geometryType) {
        super(UUID.randomUUID(), DATA_TO_GEO_WRAPPER_QUEUE);

        this.processId = processId;
        this.dbName = dbName;
        this.login = login;
        this.filePath = filePath;
        this.srs = srs;
        this.targetTableName = targetTableName;
        this.datasetId = datasetId;
        this.geometryType = geometryType;
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

    public String getSrs() {
        return srs;
    }

    public void setSrs(String srs) {
        this.srs = srs;
    }

    public String getTargetTableName() {
        return targetTableName;
    }

    public void setTargetTableName(String targetTableName) {
        this.targetTableName = targetTableName;
    }

    public String getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public String getSourceTableName() {
        return sourceTableName;
    }

    public void setSourceTableName(String sourceTableName) {
        this.sourceTableName = sourceTableName;
    }

    public String getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    @Override
    public String toString() {
        return "{" +
                "\"processId\":" + (processId == null ? "null" : "\"" + processId + "\"") + ", " +
                "\"dbName\":" + (dbName == null ? "null" : "\"" + dbName + "\"") + ", " +
                "\"login\":" + (login == null ? "null" : "\"" + login + "\"") + ", " +
                "\"filePath\":" + (filePath == null ? "null" : "\"" + filePath + "\"") + ", " +
                "\"srs\":" + (srs == null ? "null" : "\"" + srs + "\"") + ", " +
                "\"targetTableName\":" + (targetTableName == null ? "null" : "\"" + targetTableName + "\"") + ", " +
                "\"datasetId\":" + (datasetId == null ? "null" : "\"" + datasetId + "\"") + ", " +
                "\"sourceTableName\":" + (sourceTableName == null ? "null" : "\"" + sourceTableName + "\"") + ", " +
                "\"geometryType\":" + (geometryType == null ? "null" : "\"" + geometryType + "\"") +
                "}";
    }
}
