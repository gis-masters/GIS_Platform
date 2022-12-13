package ru.mycrg.wrapper.service.export;

import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Coordinate;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.math.BigDecimal;
import java.text.DecimalFormat;

public class GmlUtil {

    private GmlUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static int calculatePercent(long processedRows, long totalRows) {
        int result = Math.round(((float) processedRows / (float) totalRows) * 100);

        // 2% на остальные действия после основной выборки.
        return Math.min(result, 98);
    }

    @NotNull
    public static String convertToString(@NotNull Coordinate[] coordinates, boolean invert) {
        StringBuilder result = new StringBuilder();
        for (Coordinate coordinate: coordinates) {
            result.append(trimCoordinate(invert ? coordinate.y : coordinate.x))
                  .append(",")
                  .append(trimCoordinate(invert ? coordinate.x : coordinate.y))
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
    public static String getDefaultValue(SimplePropertyDto property) {
        if (property.getValueTypeAsEnum() == ValueType.INT || property.getValueTypeAsEnum() == ValueType.CHOICE) {
            return "0";
        }

        if (property.getValueTypeAsEnum() == ValueType.DOUBLE) {
            return "0.0000";
        }

        return "";
    }

    @NotNull
    private static String trimCoordinate(double d) {
        return new DecimalFormat("#0.00").format(d).replace(",", ".");
    }
}
