package ru.mycrg.data_service.util;

public class EcqlFilterUtil {

    private EcqlFilterUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static String addAsEqual(String sourceFilter, String param, String value) {
        return sourceFilter == null || sourceFilter.isBlank()
                ? String.format("%s='%s'", param, value)
                : String.format("%s AND %s='%s'", sourceFilter, param, value);
    }
}
