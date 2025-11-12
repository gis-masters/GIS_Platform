package ru.mycrg.acceptance.utils;

import org.geolatte.geom.ByteBuffer;
import org.geolatte.geom.Geometry;
import org.geolatte.geom.codec.Wkb;
import org.geolatte.geom.codec.WkbDecoder;
import org.geolatte.geom.codec.Wkt;
import org.geolatte.geom.codec.WktDecoder;

import java.util.Optional;

/**
 * Утилитный класс для работы с геометриями в различных форматах
 */
public class GeometryUtils {

    /**
     * Сравнивает две геометрии, которые могут быть в разных форматах (EWKB, GeoJSON)
     *
     * @param expected ожидаемая геометрия (может быть в формате EWKB hex string или WKT)
     * @param actual   актуальная геометрия (может быть в формате EWKB или GeoJSON)
     *
     * @return true если геометрии эквивалентны, false в противном случае
     */
    public static boolean isGeometriesEqual(String expected, String actual) {
        if (expected == null && actual == null) {
            System.out.println("Обе геометрии пустые.");

            return true;
        }
        if (expected == null || actual == null) {
            System.out.println("Одна из геометрий пустая.");

            return false;
        }

        //Сравнение строк не обязательное просто оно быстрее чем превращение геометрий. Попытка оптимизации.
        boolean result = expected.equals(actual);
        if (result) {
            return true;
        }

        Optional<Geometry<?>> expectedGeom = parseGeometry(expected);
        Optional<Geometry<?>> actualGeom = parseGeometry(actual);

        if (expectedGeom.isEmpty() || actualGeom.isEmpty()) {
            return false;
        }

        // Сравниваем геометрии с учетом возможных различий в точности
        return expectedGeom.equals(actualGeom) || isGeometricallyEqual(expectedGeom.get(), actualGeom.get());
    }

    /**
     * Парсит геометрию из строки, автоматически определяя формат
     */
    private static Optional<Geometry<?>> parseGeometry(String geometryString) {
        if (geometryString == null || geometryString.trim().isEmpty()) {
            return Optional.empty();
        }

        String trimmedAndBig = geometryString.trim().toUpperCase();

        try {
            // Пытаемся распарсить как EWKB (hex string)
            if (isHexString(trimmedAndBig)) {
                byte[] wkbBytes = hexStringToByteArray(trimmedAndBig);
                ByteBuffer byteBuffer = ByteBuffer.from(wkbBytes);
                WkbDecoder decoder = Wkb.newDecoder();

                return Optional.ofNullable(decoder.decode(byteBuffer));
            }

            // Пытаемся распарсить как WKT/EWKT
            if (isWktString(trimmedAndBig)) {
                WktDecoder decoder = Wkt.newDecoder();

                return Optional.ofNullable(decoder.decode(trimmedAndBig));
            }

            // Если ничего не подошло, возвращаем null
            return Optional.empty();
        } catch (Exception e) {
            System.out.println("Не получилось распарсить геометрию. Причина: " + e.getMessage());

            return Optional.empty();
        }
    }

    private static boolean isWktString(String trimmedAndBig) {
        return trimmedAndBig.startsWith("SRID=") ||
                trimmedAndBig.startsWith("POINT") ||
                trimmedAndBig.startsWith("LINESTRING") ||
                trimmedAndBig.startsWith("POLYGON") ||
                trimmedAndBig.startsWith("MULTIPOINT") ||
                trimmedAndBig.startsWith("MULTILINESTRING") ||
                trimmedAndBig.startsWith("MULTIPOLYGON") ||
                trimmedAndBig.startsWith("GEOMETRYCOLLECTION");
    }

    /**
     * Проверяет, является ли строка hex-строкой (для EWKB)
     */
    private static boolean isHexString(String str) {
        if (str == null || str.isEmpty() || str.length() % 2 != 0) {
            return false;
        }

        return str.matches("^[0-9A-Fa-f]+$");
    }

    /**
     * Конвертирует hex-строку в массив байтов
     */
    private static byte[] hexStringToByteArray(String hexString) {
        int len = hexString.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4)
                    + Character.digit(hexString.charAt(i + 1), 16));
        }

        return data;
    }

    /**
     * Сравнивает геометрии с учетом возможных различий в точности координат
     */
    private static boolean isGeometricallyEqual(Geometry<?> geom1, Geometry<?> geom2) {
        // Проверяем тип геометрии
        if (!geom1.getGeometryType().equals(geom2.getGeometryType())) {
            return false;
        }

        // Проверяем SRID (система координат)
        if (geom1.getSRID() != geom2.getSRID()) {
            return false;
        }

        return geom1.equals(geom2);
    }
}
