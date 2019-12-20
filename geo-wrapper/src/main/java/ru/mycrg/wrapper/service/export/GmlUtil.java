package ru.mycrg.wrapper.service.export;

import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Coordinate;
import ru.mycrg.mq_queue_contract.FeatureDescriptionDto;
import ru.mycrg.mq_queue_contract.SimplePropertyDto;
import ru.mycrg.mq_queue_contract.enums.ValueType;
import ru.mycrg.wrapper.exceptions.RuleNotFoundException;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;

public class GmlUtil {

    public static FeatureDescriptionDto getRuleByTableName(List<FeatureDescriptionDto> featuresDescription,
                                                           String tableName) {
        return featuresDescription.stream()
                .filter(fDescription -> fDescription.getTableName().equalsIgnoreCase(tableName))
                .findFirst()
                .orElseThrow(() -> new RuleNotFoundException(tableName));
    }

    public static int calculatePercent(long processedRows, long totalRows) {
        int result = Math.round(((float) processedRows / (float) totalRows) * 100);

        // 2% на остальные действия после основной выборки.
        return Math.min(result, 98);
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

    @NotNull
    private static String trimCoordinate(double d) {
        return new DecimalFormat("#0.00").format(d).replace(",", ".");
    }

}
