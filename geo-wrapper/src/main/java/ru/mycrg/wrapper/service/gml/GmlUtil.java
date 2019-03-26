package ru.mycrg.wrapper.service.gml;

import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Coordinate;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Optional;

public class GmlUtil {

    public static String clearName(@NotNull String name) {
        if (!name.contains("_")) {
            return name;
        }

        String[] splited = name.split("_");

        if (splited[0] != null) {
            return splited[0];
        }

        return name;
    }

    public static Optional<EntityTypeDto> getRuleByTableName(List<EntityTypeDto> entityTypes, String tableName) {
        return entityTypes.stream()
                .filter(entityType -> entityType.getName().toLowerCase().equals(tableName.toLowerCase()))
                .findFirst();
    }

    @NotNull
    public static String convertToString(@NotNull Coordinate[] coordinates) {
        StringBuilder result = new StringBuilder();
        for (Coordinate coordinate : coordinates) {
            result
                    .append(trimCoordinate(coordinate.y))
                    .append(",")
                    .append(trimCoordinate(coordinate.x))
                    .append(" ");
        }

        return result.toString().trim();
    }

    // Исправляем конвертацию BigDecimal -> "0E-8"
    public static String getString(Object value) {
        if (value instanceof BigDecimal) {
            return ((BigDecimal) value).toPlainString();
        }

        return value.toString();
    }

    @NotNull
    private static String trimCoordinate(double d) {
        return new DecimalFormat("#0.00").format(d).replace(",", ".");
    }

    @NotNull
    public static String getDefaultValue(SimplePropertyDto property) {
        if (property.getValueType() == ValueType.INT || property.getValueType() == ValueType.CHOICE) {
            return "0";
        }

        if (property.getValueType() == ValueType.DOUBLE) {
            return "0.0000";
        }

        return "";
    }

}
