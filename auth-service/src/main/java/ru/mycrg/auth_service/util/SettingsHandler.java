package ru.mycrg.auth_service.util;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
            if ("tags".equals(k)) {
                List<String> rootTags = (List<String>) rootSettings.get(k);
                List<String> orgTags = (List<String>) orgSettings.get(k);
                if (rootTags.isEmpty() || orgTags.isEmpty()) {
                    result.remove(k);
                }

                List<String> resultTags = orgTags.stream()
                                                 .filter(rootTags::contains)
                                                 .collect(Collectors.toList());

                result.put(k, resultTags);
            } else {
                boolean rootValueAllowed = Boolean.parseBoolean(v.toString());
                if (rootValueAllowed) {
                    result.put(k, orgSettings.get(k));
                } else {
                    result.put(k, v);
                }
            }
        });

        return result;
    }

    /**
     * Накладываем новые настройки поверх старых. Используем известные нам настройки.
     */
    public static Map<String, Object> overlapOldSettings(SchemaDto schema,
                                                         Map<String, Object> oldSettings,
                                                         Map<String, Object> newSettings) {
        Map<String, Object> result = new HashMap<>();
        if (oldSettings != null) {
            result = new HashMap<>(oldSettings);
        }

        for (SimplePropertyDto property: schema.getProperties()) {
            String name = property.getName();
            if (newSettings.containsKey(name)) {
                result.put(name, newSettings.get(name));
            }
        }

        return processSettings(schema, result);
    }

    /**
     * Пост-обработка настроек.
     * <p>
     * Оставляем только известные нам настройки. Явно заполняем значениями по-умолчанию.
     */
    @NotNull
    public static Map<String, Object> processSettings(SchemaDto schema, Map<String, Object> settings) {
        Map<String, Object> result = new HashMap<>();

        for (SimplePropertyDto property: schema.getProperties()) {
            String name = property.getName();
            if (settings.containsKey(name)) {
                result.put(name, settings.get(name));
            } else {
                result.put(name, property.getDefaultValue());
            }

            // Process tags props
            if ("tags".equals(property.getName())) {
                List<String> resultTags = new ArrayList<>();

                List<String> tags = (List<String>) result.get(name);
                property.getEnumerations().forEach(item -> {
                    String value = item.getValue();
                    if (tags.contains(value)) {
                        resultTags.add(item.getValue());
                    }
                });
                result.put("tags", resultTags);
            }
        }

        return result;
    }

    /**
     * Пост-обработка настроек.
     * <p>
     * Оставляем только известные нам настройки. Явно заполняем значениями по-умолчанию.
     */
    @NotNull
    public static Map<String, Object> excludeUnknownKeys(SchemaDto schema, Map<String, Object> settings) {
        Map<String, Object> result = new HashMap<>();

        for (SimplePropertyDto property: schema.getProperties()) {
            String name = property.getName();
            if (settings.containsKey(name)) {
                result.put(name, settings.get(name));
            }

            // Process tags props
            if ("tags".equals(property.getName())) {
                List<String> resultTags = new ArrayList<>();

                List<String> tags = (List<String>) result.get(name);
                if (tags == null || tags.isEmpty()) {
                    break;
                }

                property.getEnumerations().forEach(item -> {
                    String value = item.getValue();
                    if (tags.contains(value)) {
                        resultTags.add(item.getValue());
                    }
                });

                if (resultTags.isEmpty()) {
                    result.remove("tags");
                } else {
                    result.put("tags", resultTags);
                }
            }
        }

        return result;
    }
}
