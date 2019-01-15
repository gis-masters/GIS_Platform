package ru.mycrg.gis.service;

import java.util.List;

public class RequiredInfo {

    private String tableName;
    private List<String> columns;

    public RequiredInfo(String tableName, List<String> columns) {
        this.tableName = tableName;
        this.columns = columns;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }
}
