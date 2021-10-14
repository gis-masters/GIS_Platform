package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dto.ResourceType;

import java.util.Objects;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

public class ResourceQualifier {

    public static final String SEPARATOR = "\\.";

    private final String schema;
    private final String table;
    private final Long record;
    private final ResourceType type;

    public ResourceQualifier(String schema) {
        this(schema, null, null, DATASET);
    }

    public ResourceQualifier(String schema, String table) {
        this(schema, table, null, TABLE);
    }

    public ResourceQualifier(String schema, String table, ResourceType type) {
        this(schema, table, null, type);
    }

    public ResourceQualifier(@NotNull String schema,
                             @Nullable String table,
                             Long record,
                             @NotNull ResourceType type) {
        this.schema = schema;
        this.table = table;
        this.record = record;
        this.type = type;
    }

    public String getTable() {
        return table;
    }

    public String getSchema() {
        return schema;
    }

    public Long getRecord() {
        return record;
    }

    public ResourceType getType() {
        return type;
    }

    @NotNull
    public String getQualifier() {
        if (record == null && table == null) {
            return schema;
        } else {
            if (record == null) {
                return schema + SEPARATOR.charAt(1) + table;
            } else {
                return schema + SEPARATOR.charAt(1) + table + SEPARATOR.charAt(1) + record;
            }
        }
    }

    @Override
    public String toString() {
        if (Objects.equals(type, DATASET)) {
            return schema;
        } else if (Objects.equals(type, TABLE)) {
            return table;
        } else {
            return record.toString();
        }
    }
}
