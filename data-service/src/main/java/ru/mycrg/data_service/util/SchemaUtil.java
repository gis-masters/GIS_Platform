package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;

public class SchemaUtil {

    private SchemaUtil() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static Schema mapToEntity(Schema entity, SchemaDto schemaDto) {
        entity.setName(schemaDto.getName());
        entity.setClassRule(toJsonNode(schemaDto));

        String customRuleFunction = schemaDto.getCustomRuleFunction();
        if (customRuleFunction != null) {
            entity.setCustomRule(customRuleFunction);
        }

        String calcFiledFunction = schemaDto.getCalcFiledFunction();
        if (calcFiledFunction != null) {
            entity.setCalculatedFields(calcFiledFunction);
        }

        return entity;
    }

    public static boolean isPropertyExist(SchemaDto schema, String key) {
        return schema.getProperties().stream()
                     .anyMatch(property -> property.getName().equalsIgnoreCase(key));
    }

    public static boolean isFilePropertyExist(SchemaDto schema) {
        return isPropertyExistByType(schema, FILE);
    }

    public static String getEnumerationTitleByValue(SimplePropertyDto property, String value) {
        return property
                .getEnumerations().stream()
                .filter(en -> en.getValue().equals(value))
                .findFirst()
                .map(ValueTitleProjection::getTitle)
                .orElse(value);
    }

    public static Optional<String> getPropertyNameByType(ValueType type, List<SimplePropertyDto> properties) {
        return properties.stream()
                         .filter(simplePropertyDto -> simplePropertyDto.getValueType().equals(type))
                         .map(SimplePropertyDto::getName)
                         .findFirst();
    }

    public static Optional<SimplePropertyDto> getPropertyByName(SchemaDto schema, String name) {
        return schema
                .getProperties().stream()
                .filter(prDto -> prDto.getName().equalsIgnoreCase(name))
                .findFirst();
    }

    public static Map<String, Object> excludeComplexFields(SchemaDto schema, Map<String, Object> properties) {
        Map<String, Object> propsWithoutComplexFields = new HashMap<>();

        properties.keySet().forEach(name -> {
            if (!isComplexField(schema.getProperties(), name)) {
                propsWithoutComplexFields.put(name, properties.get(name));
            }
        });

        return propsWithoutComplexFields;
    }

    public static boolean isComplexField(List<SimplePropertyDto> properties, String propertyName) {
        return properties.stream()
                         .filter(property -> property.getName().equalsIgnoreCase(propertyName))
                         .anyMatch(property -> FILE.equals(property.getValueType()));
    }

    private static boolean isPropertyExistByType(SchemaDto schema, ValueType type) {
        return schema.getProperties().stream()
                     .anyMatch(property -> property.getValueType().equals(type));
    }
}
