package ru.mycrg.acceptance.data_service.processes;

public class GeometryShapePlacementModel {

    protected String datasetId;
    protected String tableName;
    protected String fileType;

    public GeometryShapePlacementModel() {
        // Required
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

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    @Override
    public String toString() {
        return "{" +
                "\"datasetId\":" + (datasetId == null ? "null" : "\"" + datasetId + "\"") + ", " +
                "\"tableName\":" + (tableName == null ? "null" : "\"" + tableName + "\"") + ", " +
                "\"fileType\":" + (fileType == null ? "null" : fileType) +
                "}";
    }
}
