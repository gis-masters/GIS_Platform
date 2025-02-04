package ru.mycrg.data_service.service.srs;

import org.geotools.referencing.CRS;
import org.opengis.referencing.ReferenceIdentifier;

import java.util.Optional;

import static ru.mycrg.data_service.util.DetailedLogger.logError;

public class SrsUtils {

    public static Optional<String> addAuthority(String wkt, String newAuthority, Integer newSrid) {
        try {
            String result = String.format("%s, %s]",
                                          wkt.substring(0, wkt.length() - 1),
                                          buildAuthority(newAuthority, newSrid.toString()));

            return Optional.of(result);
        } catch (Exception e) {
            logError("Не удалось распарсить WKT => " + e.getMessage(), e);

            return Optional.empty();
        }
    }

    public static Optional<String> replaceAuthority(String wkt, String newAuthority, Integer newSrid) {
        try {
            String result = wkt;
            Optional<ReferenceIdentifier> oIdentifier = CRS.parseWKT(wkt)
                                                           .getCoordinateSystem()
                                                           .getIdentifiers()
                                                           .stream().findFirst();
            if (oIdentifier.isPresent()) {
                ReferenceIdentifier referenceIdentifier = oIdentifier.get();
                String tempString = buildAuthority(referenceIdentifier.getCodeSpace(),
                                                   referenceIdentifier.getCode());

                result = wkt.replace(tempString, buildAuthority(newAuthority, newSrid.toString()));
            }

            return Optional.of(result);
        } catch (Exception e) {
            logError("Не удалось распарсить WKT => " + e.getMessage(), e);

            return Optional.empty();
        }
    }

    private static String buildAuthority(String codeSpace, String code) {
        return "AUTHORITY[\"" + codeSpace + "\",\"" + code + "\"]";
    }
}
