package ru.mycrg.wrapper.dao;

public class DaoProperties {

    private DaoProperties() {
        throw new IllegalStateException("Utility class");
    }

    public static final short BATCH_SIZE = 100;
    public static final String NULL_MARKER = "crg-null";

    /**
     * Название ключевой колонки(идентификатор обьекта) в таблицах представляющих слой
     */
    public static final String PRIMARY_KEY = "objectid";

    public static final String GLOBAL_KEY = "globalid";

    public static final String CLASS_ID = "classid";

    public static final String GLOBAL_ID = "globalid";

    public static final String RULE_ID = "ruleid";

    public static final String EXTENSION_POSTFIX = "_extension";

    public static final String AS_IS = "AsIs";

    public static final String NOT_IMPORT = "NotImport";

    public static final String DEFAULT_GEOMETRY_COLUMN_NAME = "shape";
}
