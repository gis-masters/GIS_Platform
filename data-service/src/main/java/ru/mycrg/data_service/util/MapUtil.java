package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.Map;

public class MapUtil {

    private MapUtil() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static Map<String, Object> clearNullable(Map<String, Object> data) {
        Map<String, Object> clearedData = new HashMap<>();
        data.forEach((k, v) -> {
            if (v != null) {
                clearedData.put(k, v);
            }
        });

        return clearedData;
    }
}
