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

    public static Integer extractCrsNumber(String crs) {
        try {
            String[] splitCrs = crs.split("EPSG:");
            if (splitCrs.length >= 2) {
                return Integer.valueOf(splitCrs[1].replaceAll("[^0-9]", ""));
            } else {
                String errorMsg = "Ошибка при получении EPSG кода. Некорректно указан формат системы координат";
                log.error(errorMsg);

                throw new EpsgParserException(errorMsg);
            }
        } catch (Exception ex) {
            String errorMsg = "Ошибка при получении EPSG кода from: " + crs;
            log.error("{}. Reason: {}", errorMsg, ex.getMessage());

            throw new DataServiceException(errorMsg);
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
            String msg = "Что-то пошло не так во время трансформации геометрии " + e.getMessage();
            log.error(msg);
            throw new TransformationException(msg);
        }
    }
}
