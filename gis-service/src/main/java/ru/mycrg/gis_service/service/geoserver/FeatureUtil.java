package ru.mycrg.gis_service.service.geoserver;

import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;
import java.util.Optional;

public class FeatureUtil {

    private static final Logger log = LoggerFactory.getLogger(FeatureUtil.class);

    /**
     * Построим название слоя(фичи) для геосервера.
     * <p>
     * Название строится по шаблону: '{tableName}__{epsgCode}'. Если tableName уже содержит '__{epsgCode}', то
     * дублироваться код не будет.
     *
     * @param tableName Название таблицы.
     * @param nativeCRS Система координат в формате "EPSG:3857"
     *
     * @return Название слоя(фичи) сформированное по шаблону: '{tableName}__{epsgCode}'
     */
    public static String buildGeoserverFeatureName(@Nullable String tableName,
                                                   @Nullable String nativeCRS) {
        if (tableName == null) {
            return "";
        }

        int indexOfLatestSeparator = tableName.lastIndexOf("__");
        String maybeCrs = tableName.substring(indexOfLatestSeparator + 1);
        Optional<Integer> oCrs = extractCrsNumber(nativeCRS);

        if (oCrs.isEmpty()) {
            return tableName;
        }

        String crs = oCrs.get().toString();
        if (Objects.equals(maybeCrs, crs)) {
            return tableName;
        }

        return String.format("%s__%s", tableName, crs);
    }

    public static Optional<Integer> extractCrsNumber(@Nullable String epsg) {
        if (epsg == null) {
            return Optional.empty();
        }

        try {
            String[] splitCrs = epsg.split(":");

            return Optional.of(Integer.valueOf(splitCrs[1]));
        } catch (Exception ex) {
            String errorMsg = String.format("Не удалось извлечь номер проекции из: '%s'. По причине: %s",
                                            epsg, ex.getMessage());
            log.error(errorMsg);

            return Optional.empty();
        }
    }
}
