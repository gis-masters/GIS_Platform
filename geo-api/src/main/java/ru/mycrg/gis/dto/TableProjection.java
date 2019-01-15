package ru.mycrg.gis.dto;

import ru.mycrg.gis.dto.fgistp.FgistpClassType;

import java.util.List;

public class TableProjection {

    private String name;
    private List<ColumnProjection> columns;
    private FgistpClassType fgistpClassType = new FgistpClassType();

    public TableProjection(String name, List<ColumnProjection> columns) {
        this.name = name;
        this.columns = columns;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ColumnProjection> getColumns() {
        return columns;
    }

    public void setColumns(List<ColumnProjection> columns) {
        this.columns = columns;
    }

    public FgistpClassType getFgistpClassType() {
        return fgistpClassType;
    }

    public void setFgistpClassType(FgistpClassType fgistpClassType) {
        this.fgistpClassType = fgistpClassType;
    }
}
