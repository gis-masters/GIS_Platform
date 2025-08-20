package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dto.ResourceType;

import static ru.mycrg.data_service.dto.ResourceType.*;

public class ResourceJsonCondition extends AQualifier {

    private final String jsonFieldName;
    private final Object jsonIdValue;

    private ResourceJsonCondition(@NotNull String schema,
                                  @NotNull String table,
                                  @NotNull String jsonFieldName,
                                  @Nullable Object jsonIdValue,
                                  @NotNull ResourceType type) {
        this.schema = schema;
        this.table = table;
        this.type = type;
        this.jsonFieldName = jsonFieldName;
        this.jsonIdValue = jsonIdValue;
        this.resourceTables.put(LIBRARY, "doc_libraries");
        this.resourceTables.put(TABLE, "schemas_and_tables");
        this.resourceTables.put(DATASET, "schemas_and_tables");
    }

    public String getJsonFieldName() {
        return jsonFieldName;
    }

    public Object getJsonIdValue() {
        return jsonIdValue;
    }

    @NotNull
    public String getTableQualifier() {
        return schema + SEPARATOR.charAt(1) + table;
    }

    public static ResourceJsonCondition byJsonIdValue(@NotNull String schema,
                                                      @NotNull String table,
                                                      @NotNull String jsonFieldName,
                                                      @NotNull Long jsonFieldValue,
                                                      @NotNull ResourceType type) {
        return new ResourceJsonCondition(schema, table, jsonFieldName, jsonFieldValue, type);
    }
}
