package ru.mycrg.data_service.service.resources;

import ru.mycrg.data_service.dto.ResourceType;

import java.util.EnumMap;
import java.util.Map;

public abstract class AQualifier {
    protected static final String SEPARATOR = "\\.";

    protected final Map<ResourceType, String> resourceTables = new EnumMap<>(ResourceType.class);

    protected String schema;
    protected String table;
    protected ResourceType type;

    /**
     * Для наборов и таблиц - schemas_and_tables, для библиотек - doc_libraries. А для записей - название таблицы.
     */
    public String getResourceTable() {
        return this.resourceTables.getOrDefault(this.type, this.table);
    }

    public ResourceType getType() {
        return type;
    }

    public String getSchema() {
        return schema;
    }

    public String getTable() {
        return table;
    }
}
