package ru.mycrg.common_contracts.generated.data_service;

public class DatasetAndTableModel {

    private String datasetTitle;
    private String datasetIdentifier;
    private String tableTitle;
    private String tableName;

    public DatasetAndTableModel() {
        //required
    }

    public DatasetAndTableModel(String datasetTitle, String datasetIdentifier, String tableTitle,
                                String tableName) {
        this.datasetTitle = datasetTitle;
        this.datasetIdentifier = datasetIdentifier;
        this.tableTitle = tableTitle;
        this.tableName = tableName;
    }

    public String getDatasetTitle() {
        return datasetTitle;
    }

    public void setDatasetTitle(String datasetTitle) {
        this.datasetTitle = datasetTitle;
    }

    public String getDatasetIdentifier() {
        return datasetIdentifier;
    }

    public void setDatasetIdentifier(String datasetIdentifier) {
        this.datasetIdentifier = datasetIdentifier;
    }

    public String getTableTitle() {
        return tableTitle;
    }

    public void setTableTitle(String tableTitle) {
        this.tableTitle = tableTitle;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
}
