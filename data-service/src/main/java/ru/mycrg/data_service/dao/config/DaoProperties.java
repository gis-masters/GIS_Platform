package ru.mycrg.data_service.dao.config;

public class DaoProperties {

    private DaoProperties() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Различные ключевые параметры.
     */
    public static final String ID = "id";

    public static final String PRIMARY_KEY = "objectid";

    public static final String RULE_ID = "ruleid";

    public static final String EXTENSION_POSTFIX = "_extension";

    public static final String DEFAULT_GEOMETRY_COLUMN_NAME = "shape";

    public static final String GISOGFRF_RESPONSE = "gisogdrf_response";
    public static final String GISOGFRF_AUDIT_DATETIME = "gisogdrf_audit_datetime";
    public static final String GISOGFRF_PUBLICATION_DATETIME = "gisogdrf_publication_datetime";
}
