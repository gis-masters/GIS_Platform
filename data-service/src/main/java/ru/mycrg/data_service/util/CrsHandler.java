package ru.mycrg.data_service.util;

import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.TransformationException;

@Service
public class CrsHandler {

    public static final Logger log = LoggerFactory.getLogger(CrsHandler.class);

    private final EpsgCodes epsgCodes;

    public CrsHandler(EpsgCodes epsgCodes) {
        this.epsgCodes = epsgCodes;
    }

    public Integer extractCrsNumber(String crs) {
        try {
            String[] splitCrs = crs.split(":");

            return Integer.valueOf(splitCrs[1]);
        } catch (Exception ex) {
            String errorMsg = "Error while getting crs number(srid)." + ex.getMessage();
            log.error(errorMsg);
            throw new DataServiceException(errorMsg);
        }
    }

    public CoordinateReferenceSystem defineCrsByX(double coordinateXToDefineCRS) {
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
            String msg = "Something went wrong while geometry transformation" + e.getMessage();
            log.error(msg);
            throw new TransformationException(msg);
        }
    }

    public CoordinateReferenceSystem defineCrsBySrid(int srid) {
        try {
            if (srid == 314314) {
                return epsgCodes.getCrsBySrid(314314);
            } else if (srid == 314315) {
                return epsgCodes.getCrsBySrid(314315);
            } else {
                return CRS.decode("EPSG:" + srid);
            }
        } catch (FactoryException e) {
            String msg = "Something went wrong while geometry transformation" + e.getMessage();
            log.error(msg);
            throw new TransformationException(msg);
        }
    }
}
