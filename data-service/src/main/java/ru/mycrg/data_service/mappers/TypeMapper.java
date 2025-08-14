package ru.mycrg.data_service.mappers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.ColumnShortInfo;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.Optional;

public class TypeMapper {

    private static final Logger log = LoggerFactory.getLogger(TypeMapper.class);

    public static Optional<ValueType> map(@NotNull ColumnShortInfo columnShortInfo) {
        String udtName = columnShortInfo.getUdtName();
        Integer scale = columnShortInfo.getNumericScale();

        if (udtName == null || udtName.trim().isEmpty()) {
            return Optional.empty();
        }

        switch (udtName.trim().toLowerCase()) {
            case "varchar":
                return Optional.of(ValueType.STRING);
            case "data":
                return Optional.of(ValueType.DATETIME);
            case "geometry":
                return Optional.of(ValueType.GEOMETRY);
            case "boolean":
                return Optional.of(ValueType.BOOLEAN);
            case "float8":
                return Optional.of(ValueType.DOUBLE);
            case "numeric":
                if (scale == null) {
                    return Optional.of(ValueType.INT);
                } else {
                    return scale <= 0 ? Optional.of(ValueType.INT) : Optional.of(ValueType.DOUBLE);
                }
            case "int8":
            case "int4":
                return Optional.of(ValueType.INT);
            default:
                return Optional.empty();
        }
    }

    public static boolean compare(String dbType, ValueType schemaType) {
        switch (schemaType) {
            case GEOMETRY:
                return dbType.equalsIgnoreCase(schemaType.name());
            case LONG:
            case USER_ID:
                return dbType.toLowerCase().contains("int8");
            case INT:
                return dbType.toLowerCase().contains("int4");
            case DOUBLE:
                return dbType.toLowerCase().contains("numeric");
            case CHOICE:
                return dbType.equalsIgnoreCase("varchar") || dbType.contains("int");
            case STRING:
            case DOCUMENT:
                return dbType.equalsIgnoreCase("varchar");
            case DATETIME:
                return dbType.equalsIgnoreCase("timestamp");
            case URL:
            case TEXT:
            case USER:
            case LOOKUP:
                return dbType.equalsIgnoreCase("text");
            case BOOLEAN:
                return dbType.equalsIgnoreCase("bool");
            case FILE:
            case VERSIONS:
                return dbType.equalsIgnoreCase("jsonb");
            case UUID:
                return dbType.equalsIgnoreCase("uuid");
            default:
                log.warn("TypeComparator не знает как сравнить '{}' и '{}'", schemaType.name(), dbType);

                return false;
        }
    }
}
