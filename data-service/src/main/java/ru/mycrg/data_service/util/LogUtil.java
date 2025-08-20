package ru.mycrg.data_service.util;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

public class LogUtil {

    private LogUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static Map<String, Object> withoutHeavyFields(Map<String, Object> content) {
        Map<String, Object> result = new HashMap<>();

        content.forEach((k, v) -> {
            if (!k.equalsIgnoreCase(DEFAULT_GEOMETRY_COLUMN_NAME)) {
                result.put(k, v);
            } else {
                result.put(k, "Геометрия намерено вырезана");
            }
        });

        return result;
    }
}
