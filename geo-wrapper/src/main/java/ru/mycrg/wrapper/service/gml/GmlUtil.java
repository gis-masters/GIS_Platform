package ru.mycrg.wrapper.service.gml;

import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Coordinate;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.wrapper.exceptions.RuleNotFoundException;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;

class GmlUtil {

    static EntityTypeDto getRuleByTableName(List<EntityTypeDto> entityTypes, String tableName)
            throws RuleNotFoundException {
        return entityTypes.stream()
                .filter(entityType -> entityType.getTableName().toLowerCase().equals(tableName.toLowerCase()))
                .findFirst()
                .orElseThrow(() -> new RuleNotFoundException(tableName));
    }

    @NotNull
    static String convertToString(@NotNull Coordinate[] coordinates) {
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
    static String getString(Object value) {
        if (value instanceof BigDecimal) {
            return ((BigDecimal) value).toPlainString();
        }

        return value.toString();
    }

    @NotNull
    static String getDefaultValue(SimplePropertyDto property) {
        if (property.getValueType() == ValueType.INT || property.getValueType() == ValueType.CHOICE) {
            return "0";
        }

        if (property.getValueType() == ValueType.DOUBLE) {
            return "0.0000";
        }

        return "";
    }

    static int calculatePercent(long done, long total) {
        int result = Math.round(((float) done / (float) total) * 100);

        // 2% на остальные действия после основной выборки.
        return result > 98 ? 98 : result;
    }

    @NotNull
    private static String trimCoordinate(double d) {
        return new DecimalFormat("#0.00").format(d).replace(",", ".");
    }

}
