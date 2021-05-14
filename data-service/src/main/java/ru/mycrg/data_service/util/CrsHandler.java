package ru.mycrg.data_service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.exceptions.DataServiceException;

public class CrsHandler {

    public static final Logger log = LoggerFactory.getLogger(CrsHandler.class);

    private CrsHandler() {
        throw new IllegalStateException("Utility class");
    }

    public static Integer extractCrsNumber(String crs) {
        try {
            String[] splitCrs = crs.split(":");

            return Integer.valueOf(splitCrs[1]);
        } catch (Exception ex) {
            String errorMsg = "Error while getting crs number(srid)." + ex.getMessage();
            log.error(errorMsg);
            throw new DataServiceException(errorMsg);
        }
    }
}
