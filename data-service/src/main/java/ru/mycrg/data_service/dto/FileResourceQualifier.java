package ru.mycrg.data_service.dto;

public class FileResourceQualifier {

    private String schema;
    private String table;
    private Long recordId;
    private String field;

    public FileResourceQualifier() {
        // Required
    }

    public FileResourceQualifier(String schema, String table, Long recordId) {
        this(schema, table, recordId, null);
    }

    public FileResourceQualifier(String schema, String table, Long recordId, String field) {
        this.schema = schema;
        this.table = table;
        this.recordId = recordId;
        this.field = field;
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

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }
}
