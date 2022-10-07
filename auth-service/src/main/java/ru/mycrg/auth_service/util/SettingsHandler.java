package ru.mycrg.auth_service.util;

import java.util.HashMap;
import java.util.Map;

public class SettingsHandler {

    public static Map<String, Object> mergeSettings(Map<String, Object> rootSettings,
                                                    Map<String, Object> orgSettings) {
        Map<String, Object> result = new HashMap<>();
        result.putAll(orgSettings);
        result.putAll(rootSettings);

        return result;
    }
}
