package ru.mycrg.auth_service.util;

import java.util.HashMap;
import java.util.Map;

public class SettingsHandler {

    private SettingsHandler() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Выводит результирующие настройки исходя из параметров выставленных администратором системы и администратором
     * организации.
     *
     * @param rootSettings Настройки для организации указанные администратором системы.
     * @param orgSettings  Настройки указанные администратором организации.
     */
    public static Map<String, Object> mergeSettings(Map<String, Object> rootSettings,
                                                    Map<String, Object> orgSettings) {
        Map<String, Object> result = new HashMap<>();
        if (rootSettings.isEmpty() && orgSettings.isEmpty()) {
            return result;
        } else if (rootSettings.isEmpty()) {
            result.putAll(orgSettings);

            return result;
        } else if (orgSettings.isEmpty()) {
            result.putAll(rootSettings);

            return result;
        }

        rootSettings.forEach((k, v) -> {
            boolean rootValueAllowed = Boolean.parseBoolean(v.toString());
            if (rootValueAllowed) {
                result.put(k, orgSettings.get(k));
            } else {
                result.put(k, v);
            }
        });

        return result;
    }
}
