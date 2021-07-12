package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dto.ResourceType;

import java.util.Objects;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

public class ResourceQualifier {

    public static final String SEPARATOR = "\\.";

    private final String schema;
    private final String table;
    private final String object;
    private final ResourceType type;

    public ResourceQualifier(String schema) {
        this(schema, null, null, SCHEMA);
    }

    public ResourceQualifier(String schema, String table) {
        this(schema, table, null, TABLE);
    }

    public ResourceQualifier(String schema, String table, ResourceType type) {
        this(schema, table, null, type);
    }

    public ResourceQualifier(@NotNull String schema,
                             @Nullable String table,
                             @Nullable String object,
                             @NotNull ResourceType type) {
        this.schema = schema;
        this.table = table;
        this.object = object;
        this.type = type;
    }

    public String getTable() {
        return table;
    }

    public String getSchema() {
        return schema;
    }

    public String getObject() {
        return object;
    }

    public ResourceType getType() {
        return type;
    }

    @NotNull
    public String getQualifier() {
        if (object == null && table == null) {
            return schema;
        } else {
            if (object == null) {
                return schema + SEPARATOR.charAt(1) + table;
            } else {
                return schema + SEPARATOR.charAt(1) + table + SEPARATOR.charAt(1) + object;
            }
        }
    }

    @Override
    public String toString() {
        if (Objects.equals(type, SCHEMA)) {
            return schema;
        } else if (Objects.equals(type, TABLE)) {
            return table;
        } else {
            return object;
        }
    }
}
