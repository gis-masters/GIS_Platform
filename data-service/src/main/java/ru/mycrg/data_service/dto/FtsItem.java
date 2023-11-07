package ru.mycrg.data_service.dto;

public class FtsItem {

    /**
     * Less is better.
     */
    private float dist;
    private String schema;
    private String table;
    private Long id;

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
}
