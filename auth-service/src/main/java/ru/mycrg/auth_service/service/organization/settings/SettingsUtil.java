package ru.mycrg.auth_service.service.organization.settings;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

public class SettingsUtil {

    private static final Logger log = LoggerFactory.getLogger(SettingsUtil.class);

    private SettingsUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Выводит результирующие настройки исходя из параметров выставленных администратором системы и администратором
     * организации.
     *
     * @param systemSettings Настройки для организации указанные администратором системы.
     * @param orgSettings    Настройки указанные администратором организации.
     */
    public static Map<String, Object> mergeSettings(@Nullable Map<String, Object> systemSettings,
                                                    @Nullable Map<String, Object> orgSettings) {
        if (systemSettings == null || orgSettings == null) {
            return new HashMap<>();
        }

        Map<String, Object> result = new HashMap<>();
        if (systemSettings.isEmpty()) {
            return result;
        } else if (orgSettings.isEmpty()) {
            result.putAll(systemSettings);

            return result;
        }

        systemSettings.forEach((k, v) -> {
            if ("tags".equals(k)) {
                List<String> rootTags = (List<String>) systemSettings.get(k);
                List<String> orgTags = (List<String>) orgSettings.get(k);
                if (rootTags.isEmpty() || orgTags.isEmpty()) {
                    result.remove(k);
                }

                List<String> resultTags = orgTags.stream()
                                                 .filter(rootTags::contains)
                                                 .collect(Collectors.toList());

                result.put(k, resultTags);
            } else if ("favorites_epsg".equals(k)) {
                List<String> rootEpsg = (List<String>) systemSettings.get(k);
                List<String> orgEpsg = (List<String>) orgSettings.get(k);
                if (rootEpsg == null || rootEpsg.isEmpty() || orgEpsg == null || orgEpsg.isEmpty()) {
                    result.remove(k);
                } else {
                    List<String> resultEpsg = orgEpsg.stream()
                                                     .filter(rootEpsg::contains)
                                                     .collect(Collectors.toList());

                    result.put(k, resultEpsg);
                }
            } else {
                if (TRUE.equals(v)) {
                    if (orgSettings.containsKey(k)) {
                        result.put(k, orgSettings.get(k));
                    }
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
            if ("tags".equals(name)) {
                List<String> resultTags = new ArrayList<>();
                List<String> tags = (List<String>) result.get(name);
                if (tags == null || tags.isEmpty()) {
                    result.put("tags", resultTags);

                    continue;
                }

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
                try {
                    List<String> resultTags = new ArrayList<>();

                    List<String> tags = (List<String>) result.get(name);
                    if (tags == null || tags.isEmpty()) {
                        continue;
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
                } catch (Exception e) {
                    String msg = "Структура поля tags не соответствует ожиданию.";
                    log.error("{}. По причине: {}", msg, e.getMessage(), e);

                    throw new BadRequestException(msg);
                }
            }
        }

        return result;
    }

    /**
     * Формируем схему настроек конкретной организации, опираясь на настройки определенные администратором системы.
     * <p>
     * Разрешенные свойства будут транслированы в схему. Запрещенные явно или отсутствующие в схему не попадут.
     *
     * @param baseSchema  Базовая схема настроек организации.
     * @param orgSettings Настройки организации.
     *
     * @return Схема измененная по заданным системным администратором и владельцем организации настройкам.
     */
    public static SchemaDto buildSchema(SchemaDto baseSchema, OrgSettingsResponseDto orgSettings) {
        try {
            SchemaDto newSchema = new SchemaDto();
            newSchema.setName(baseSchema.getName());
            newSchema.setTableName(baseSchema.getTableName());
            newSchema.setTitle(baseSchema.getTitle());
            newSchema.setDescription(baseSchema.getDescription());

            Map<String, Object> systemSettings = orgSettings.getSystem();
            if (systemSettings == null || systemSettings.isEmpty()) {
                return newSchema;
            }

            List<SimplePropertyDto> newProperties = new ArrayList<>(baseSchema.getProperties());
            for (SimplePropertyDto property: baseSchema.getProperties()) {
                String name = property.getName();
                boolean propertyExistAndNotNull = systemSettings.containsKey(name) && systemSettings.get(name) != null;
                switch (name) {
                    case "tags":
                        if (propertyExistAndNotNull) {
                            List<String> tags = (List<String>) systemSettings.get(name);
                            List<ValueTitleProjection> allowedTags = property
                                    .getEnumerations().stream()
                                    .filter(item -> tags.contains(item.getTitle()))
                                    .collect(Collectors.toList());

                            newProperties.stream()
                                         .filter(propertyDto -> propertyDto.getName().equals("tags"))
                                         .findFirst()
                                         .ifPresent(propertyDto -> propertyDto.setEnumerations(allowedTags));
                        }
                        break;
                    case "storageSize":
                        if (propertyExistAndNotNull) {
                            newProperties.stream()
                                         .filter(propertyDto -> propertyDto.getName().equals("storageSize"))
                                         .findFirst()
                                         .ifPresent(prop -> {
                                             prop.setReadOnly(true);
                                             prop.setDefaultValue(systemSettings.get(name));
                                         });
                        }
                        break;
                    case "favorites_epsg":
                        if (propertyExistAndNotNull) {
                            List<String> epsg = (List<String>) systemSettings.get(name);
                            List<ValueTitleProjection> allowedEpsg = property
                                    .getEnumerations()
                                    .stream()
                                    .filter(item -> epsg.contains(item.getTitle()))
                                    .collect(Collectors.toList());

                            newProperties.stream()
                                         .filter(propertyDto -> propertyDto.getName().equals("favorites_epsg"))
                                         .findFirst()
                                         .ifPresent(propertyDto -> propertyDto.setEnumerations(allowedEpsg));
                        }
                        break;
                    default:
                        if (propertyExistAndNotNull) {
                            if (FALSE.equals(systemSettings.get(name))) {
                                newProperties.removeIf(p -> Objects.equals(name, p.getName()));
                            }
                        } else {
                            newProperties.removeIf(p -> Objects.equals(name, p.getName()));
                        }
                        break;
                }
            }

            newSchema.setProperties(newProperties);

            return newSchema;
        } catch (Exception e) {
            String msg = "Не удалось сформировать схему настроек организации";
            log.error("{}. По причине: {}", msg, e.getMessage(), e);

            throw new AuthServiceException(msg);
        }
    }
}
