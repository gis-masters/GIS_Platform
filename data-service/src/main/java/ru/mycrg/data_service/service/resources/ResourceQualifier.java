package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dto.ResourceType;

import java.util.EnumMap;
import java.util.Map;
import java.util.Objects;

import static ru.mycrg.data_service.dto.ResourceType.*;

public class ResourceQualifier {

    private static final String SEPARATOR = "\\.";

    private final String schema;
    private final String table;
    private final Object recordId;
    private final ResourceType type;
    private final Map<ResourceType, String> resourceTables = new EnumMap<>(ResourceType.class);

    public ResourceQualifier(ResourceQualifier rQualifier, Object recordId, ResourceType type) {
        this(rQualifier.getSchema(), rQualifier.getTable(), recordId, type);
    }

    public ResourceQualifier(ResourceQualifier qualifier, Long recordId) {
        this(qualifier.getSchema(),
             qualifier.getTable(),
             recordId,
             qualifier.getType().equals(FEATURE) ? FEATURE : LIBRARY_RECORD);
    }

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
                             Object recordId,
                             @NotNull ResourceType type) {
        this.schema = schema;
        this.table = table;
        this.recordId = recordId;
        this.type = type;

        this.resourceTables.put(LIBRARY, "doc_libraries");
        this.resourceTables.put(TABLE, "schemas_and_tables");
        this.resourceTables.put(DATASET, "schemas_and_tables");
    }

    public String getTable() {
        return table;
    }

    /**
     * Для наборов и таблиц - schemas_and_tables, для библиотек - doc_libraries. А для записей - название таблицы.
     */
    public String getResourceTable() {
        return this.resourceTables.getOrDefault(this.type, this.table);
    }

    public String getSchema() {
        return schema;
    }

    public Long getRecordIdAsLong() {
        if (recordId != null) {
            return Long.parseLong(recordId.toString());
        }

        return -1L;
    }

    @Nullable
    public Object getRecordId() {
        return recordId;
    }

    public ResourceType getType() {
        return type;
    }

    @NotNull
    public String getTableQualifier() {
        return schema + SEPARATOR.charAt(1) + table;
    }

    @NotNull
    public String getQualifier() {
        if (recordId == null && table == null) {
            return schema;
        } else {
            if (recordId == null) {
                return schema + SEPARATOR.charAt(1) + table;
            } else {
                return schema + SEPARATOR.charAt(1) + table + SEPARATOR.charAt(1) + recordId;
            }
        }
    }

    @Override
    public String toString() {
        if (Objects.equals(type, DATASET)) {
            return schema;
        } else if (Objects.equals(type, TABLE) || Objects.equals(type, LIBRARY)) {
            return table;
        } else {
            return recordId.toString();
        }
    }
}
