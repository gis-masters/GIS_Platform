package ru.mycrg.data_service.util;

import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.TransformationException;
import ru.mycrg.data_service.service.parsers.exceptions.EpsgParserException;

public class CrsHandler {

    private static final Logger log = LoggerFactory.getLogger(CrsHandler.class);

    private static final EpsgCodes epsgCodes = new EpsgCodes();

    private CrsHandler() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Извлекает номер CRS из строки. Поддерживаются форматы: - "EPSG:XXXX" - "urn:ogc:def:crs:EPSG:XXXX" где XXXX -
     * только цифры
     *
     * @param crs строка с кодом CRS
     *
     * @return числовое значение CRS
     *
     * @throws DataServiceException если строка пустая или null
     * @throws EpsgParserException  если формат строки некорректен или после EPSG: есть нецифровые символы
     */
    public static Integer extractCrsNumber(String crs) {
        if (crs == null || crs.isBlank()) {
            throw new DataServiceException("Строка CRS не может быть null или пустой");
        }

        // Нормализация строки (верхний регистр + обрезка пробелов)
        String normalizedCrs = crs.toUpperCase().trim();

        // Определение позиции "EPSG:" в строке
        int epsgIndex = normalizedCrs.indexOf("EPSG:");
        if (epsgIndex == -1) {
            String errorMsg = String.format("Неверный формат CRS: '%s'. Не найден префикс EPSG", crs);
            log.error(errorMsg);
            throw new EpsgParserException(errorMsg);
        }

        // Извлечение части после "EPSG:"
        String numberPart = normalizedCrs.substring(epsgIndex + 5); // 5 - длина "EPSG:"

        // Проверка, что после EPSG: идут только цифры до конца строки или до следующего разделителя
        if (!numberPart.matches("^\\d+($|[^\\w])")) {
            String errorMsg = String.format("Неверный формат номера CRS: '%s'. После 'EPSG:' должны быть только цифры",
                                            crs);
            log.error(errorMsg);
            throw new EpsgParserException(errorMsg);
        }

        // Извлечение только цифр
        String digitsOnly = numberPart.replaceAll("[^0-9]", "");

        try {
            return Integer.valueOf(digitsOnly);
        } catch (NumberFormatException e) {
            String errorMsg = String.format("Невозможно преобразовать номер CRS: '%s'. Число слишком большое", crs);
            log.error("Ошибка преобразования числа: {}", errorMsg, e);
            throw new DataServiceException(errorMsg, e);
        }
    }

    public static CoordinateReferenceSystem defineCrsByX(double coordinateXToDefineCRS) {
        double coordinateX = coordinateXToDefineCRS / 100000;

        try {
            // Pulkovo 1963 zone 4
            if (coordinateX >= 40 && coordinateX < 50) {
                return epsgCodes.getCrsBySrid(314315);
            }
            // Pulkovo 1963 zone 5
            else if (coordinateX >= 50 && coordinateX < 60) {
                return epsgCodes.getCrsBySrid(314314);
            }
            //Pulkovo 1963 zone 6
            else if (coordinateX >= 60 && coordinateX < 70) {
                return CRS.decode("EPSG: 28406");
            } else {
                String msg = "Координатная система не может быть определена";
                log.warn(msg);

                throw new TransformationException(msg);
            }
        } catch (FactoryException e) {
            String msg = "Что-то пошло не так во время трансформации геометрии " + e.getMessage();
            log.error(msg);

            throw new TransformationException(msg);
        }
    }

    public static CoordinateReferenceSystem defineCrsBySrid(int srid) {
        try {
            if (srid == 314314) {
                return epsgCodes.getCrsBySrid(314314);
            } else if (srid == 314315) {
                return epsgCodes.getCrsBySrid(314315);
            } else {
                return CRS.decode("EPSG:" + srid);
            }
        } catch (FactoryException e) {
            String msg = "Не удалось определить код EPSG => " + e.getMessage();
            log.error(msg);

            throw new TransformationException(msg);
        }
    }
}
