package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dto.ResourceType;

import java.util.Objects;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.*;

public class ResourceQualifier extends AQualifier {

    private final Object recordId;
    private final String field;

    public ResourceQualifier(ResourceQualifier rQualifier, Object recordId, ResourceType type) {
        this(rQualifier.getSchema(), rQualifier.getTable(), recordId, type);
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

    public ResourceQualifier(String schema, String table, Object recordId, ResourceType type) {
        this(schema, table, recordId, null, type);
    }

    public ResourceQualifier(@NotNull String schema,
                             @Nullable String table,
                             Object recordId,
                             @Nullable String field,
                             @NotNull ResourceType type) {
        this.schema = schema;
        this.table = table;
        this.recordId = recordId;
        this.field = field;
        this.type = type;

        this.resourceTables.put(LIBRARY, "doc_libraries");
        this.resourceTables.put(TABLE, "schemas_and_tables");
        this.resourceTables.put(DATASET, "schemas_and_tables");
    }

    public static ResourceQualifier systemTable(String tableName) {
        return new ResourceQualifier(SYSTEM_SCHEMA_NAME, tableName, TABLE);
    }

    public static ResourceQualifier libraryQualifier(String libraryName) {
        return new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryName, LIBRARY);
    }

    public static ResourceQualifier libraryRecordQualifier(String libraryName, Long id) {
        return new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryName, id, LIBRARY_RECORD);
    }

    public static ResourceQualifier recordQualifier(ResourceQualifier qualifier, Long id) {
        return new ResourceQualifier(qualifier.getSchema(), qualifier.getTable(), id, shiftDownType(qualifier));
    }

    public static ResourceQualifier fieldQualifier(ResourceQualifier qualifier, Long id, String field) {
        return new ResourceQualifier(qualifier.getSchema(), qualifier.getTable(), id, field, shiftDownType(qualifier));
    }

    public static ResourceQualifier tableQualifier(String dataset, String table) {
        return new ResourceQualifier(dataset, table);
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

    @Nullable
    public String getField() {
        return field;
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
                if (field == null) {
                    return schema + SEPARATOR.charAt(1) +
                            table + SEPARATOR.charAt(1) +
                            recordId;
                } else {
                    return schema + SEPARATOR.charAt(1) +
                            table + SEPARATOR.charAt(1) +
                            recordId + SEPARATOR.charAt(1) +
                            field;
                }
            }
        }
    }

    public String getPrimaryKeyName() {
        return this.type.equals(FEATURE) || this.type.equals(TABLE)
                ? PRIMARY_KEY
                : ID;
    }

    @Override
    public String toString() {
        if (Objects.equals(type, DATASET)) {
            return schema;
        } else if (Objects.equals(type, TABLE) || Objects.equals(type, LIBRARY)) {
            return table;
        } else {
            return recordId == null ? "" : recordId.toString();
        }
    }

    // Когда нужно перейти к более конкретному объекту, от библиотеки/слоя к конкретной записи.
    private static @NotNull ResourceType shiftDownType(ResourceQualifier qualifier) {
        ResourceType type = qualifier.getType();
        switch (type) {
            case TABLE:
            case FEATURE:
                return FEATURE;
            case LIBRARY:
            case LIBRARY_RECORD:
                return LIBRARY_RECORD;
            default:
                return type;
        }
    }
}
