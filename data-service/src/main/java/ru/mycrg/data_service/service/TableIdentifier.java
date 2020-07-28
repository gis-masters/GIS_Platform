package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;

public class TableIdentifier {

    private static final String IDENTIFIER_SEPARATOR = ":";

    private String schema;
    private String table;

    public TableIdentifier() {
    }

    public TableIdentifier(String schema, String table) {
        this.schema = schema;
        this.table = table;
    }

    public String getSchema() {
        return schema;
    }

    public String getTable() {
        return table;
    }

    @NotNull
    public String toString() {
        return this.schema + IDENTIFIER_SEPARATOR + this.table;
    }

    @NotNull
    public String toSqlQueryId() {
        return this.schema + "." + this.table;
    }

    public static String extractTableName(@NotNull String complexName) {
        return getByIndex(complexName, 1);
    }

    public static String extractSchemaName(@NotNull String complexName) {
        return getByIndex(complexName, 0);
    }

    private static String getByIndex(@NotNull String complexName, int i) {
        try {
            return complexName.split(IDENTIFIER_SEPARATOR)[i];
        } catch (IndexOutOfBoundsException e) {
            return "";
        }
    }
}
