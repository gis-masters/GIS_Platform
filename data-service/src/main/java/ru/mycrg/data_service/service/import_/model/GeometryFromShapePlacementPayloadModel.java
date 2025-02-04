package ru.mycrg.data_service.service.import_.model;

import ru.mycrg.data_service_contract.enums.FileType;

public class GeometryFromShapePlacementPayloadModel {

    protected String filePath;
    protected String datasetId;
    protected String tableName;
    protected FileType fileType;

    public GeometryFromShapePlacementPayloadModel() {
        // Required
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }
}
