package ru.mycrg.data_service.dto;

import java.util.Objects;

public class FtsItem {

    /**
     * Less is better.
     */
    private float dist;
    private String schema;
    private String table;
    private Long id;
    private String concatenatedData;

    public FtsItem() {
        // Required
    }

    public float getDist() {
        return dist;
    }

    public void setDist(float dist) {
        this.dist = dist;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConcatenatedData() {
        return concatenatedData;
    }

    public void setConcatenatedData(String concatenatedData) {
        this.concatenatedData = concatenatedData;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FtsItem ftsItem = (FtsItem) o;
        return Objects.equals(schema, ftsItem.schema) && Objects.equals(table,
                                                                        ftsItem.table) && Objects.equals(
                id, ftsItem.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(schema, table, id);
    }
}
