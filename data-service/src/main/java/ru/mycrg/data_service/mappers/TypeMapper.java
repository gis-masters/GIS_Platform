package ru.mycrg.data_service.mappers;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.ColumnInfoDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.Optional;

public class TypeMapper {

    public static Optional<ValueType> map(@NotNull ColumnInfoDto columnInfo) {
        String type = columnInfo.getType();
        Integer scale = columnInfo.getScale();

        if (type == null || type.trim().isEmpty()) {
            return Optional.empty();
        }

        switch (type.trim().toLowerCase()) {
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
                    return (scale <= 0) ? Optional.of(ValueType.INT) : Optional.of(ValueType.DOUBLE);
                }
            case "int8":
            case "int4":
                return Optional.of(ValueType.INT);
            default:
                return Optional.empty();
        }
    }
}
