package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;

public class ResourceIdentifier {

    public static final String IDENTIFIER_SEPARATOR = ":";

    private ResourceIdentifier() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static String makeIdentifier(String schemaName, String tableName) {
        return schemaName + IDENTIFIER_SEPARATOR + tableName;
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
