package ru.mycrg.gis.dto;

import ru.mycrg.gis.dto.fgistp.EntityType;

import java.util.List;

public class TableProjection {

    private String name;
    private List<ColumnProjection> columns;
    private EntityType entityType = new EntityType();

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

    public EntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(EntityType entityType) {
        this.entityType = entityType;
    }
}
