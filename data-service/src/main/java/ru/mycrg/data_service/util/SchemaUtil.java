package ru.mycrg.data_service.util;

import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.List;
import java.util.Optional;

public class SchemaUtil {

    private SchemaUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static boolean isPropertyExist(SchemaDto schema, String key) {
        return schema.getProperties().stream()
                     .anyMatch(property -> property.getName().equals(key));
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

    public static Optional<SimplePropertyDto> getPropertyByName(SchemaDto schemaDto, String name) {
        return schemaDto
                .getProperties().stream()
                .filter(prDto -> prDto.getName().equalsIgnoreCase(name))
                .findFirst();
    }
}
