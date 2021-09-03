package ru.mycrg.data_service.service.import_.model;

public class DataTable {

    private String title;
    private String identifier;
    private String crs;
    private String schemaId;

    public DataTable(String title, String identifier, String crs, String schemaId) {
        this.title = title;
        this.identifier = identifier;
        this.crs = crs;
        this.schemaId = schemaId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }
}
