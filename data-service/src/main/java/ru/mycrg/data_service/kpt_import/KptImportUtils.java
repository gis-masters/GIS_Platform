package ru.mycrg.data_service.kpt_import;

public class KptImportUtils {

    private static final String CADASTRAL_NUM_SEPARATOR = ":";
    private static final String TMP_TABLE_PREFIX = "kpt_";

    public static String extractNumberFromCadastralNum(String cadastralnum) {
        var parts = cadastralnum.split(CADASTRAL_NUM_SEPARATOR);
        return parts[parts.length - 1];
    }

    public static String tmbTableName(String schemaName) {
        return TMP_TABLE_PREFIX + schemaName;
    }
}
