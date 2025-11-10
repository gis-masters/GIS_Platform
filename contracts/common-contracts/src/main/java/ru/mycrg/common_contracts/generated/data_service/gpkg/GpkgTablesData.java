package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.io.Serializable;

public class GpkgTablesData implements Serializable {

    private GpkgTableType type;
    private String tableGpkgIdentifier;
    private String tableNewIdentifier;
    private Long rowsCount;

    public GpkgTablesData() {

    }

    public GpkgTablesData(GpkgTableType type, String tableGpkgIdentifier) {
        this.type = type;
        this.tableGpkgIdentifier = tableGpkgIdentifier;
    }

    public GpkgTableType getType() {
        return type;
    }

    public void setType(GpkgTableType type) {
        this.type = type;
    }

    public String getTableGpkgIdentifier() {
        return tableGpkgIdentifier;
    }

    public void setTableGpkgIdentifier(String tableGpkgIdentifier) {
        this.tableGpkgIdentifier = tableGpkgIdentifier;
    }

    public String getTableNewIdentifier() {
        return tableNewIdentifier;
    }

    public void setTableNewIdentifier(String tableNewIdentifier) {
        this.tableNewIdentifier = tableNewIdentifier;
    }

    public Long getRowsCount() {
        return rowsCount;
    }

    public void setRowsCount(Long rowsCount) {
        this.rowsCount = rowsCount;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "\"tableName\":" + (tableGpkgIdentifier == null ? "null" : "\"" + tableGpkgIdentifier + "\"") + ", " +
                "\"rowsCount\":" + (rowsCount == null ? "null" : "\"" + rowsCount + "\"") +
                "}";
    }
}
