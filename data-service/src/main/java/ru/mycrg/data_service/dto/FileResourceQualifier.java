package ru.mycrg.data_service.dto;

import static ru.mycrg.common_utils.CrgGlobalProperties.join;

public class FileResourceQualifier {

    private String schema;
    private String table;
    private Long recordId;
    private String field;

    public FileResourceQualifier() {
        // Required
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

    @Override
    public String toString() {
        return join(
                table == null || table.isBlank() ? "" : table,
                recordId == null ? "" : String.valueOf(recordId),
                field == null || field.isBlank() ? "" : field
        );
    }
}
