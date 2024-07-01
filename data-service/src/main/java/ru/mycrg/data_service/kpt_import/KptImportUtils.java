package ru.mycrg.data_service.kpt_import;

import ru.mycrg.data_service.kpt_import.model.generated.OrdinateBound;
import ru.mycrg.data_service.kpt_import.model.generated.OrdinateOKSOut;
import ru.mycrg.data_service.kpt_import.model.generated.OrdinateZacrep;

public class KptImportUtils {

    private static final String CADASTRAL_NUM_SEPARATOR = ":";
    private static final String TMP_TABLE_PREFIX = "kpt_";

    public static final String DS_ID = "kpt_import_";

    public static String extractNumberFromCadastralNum(String cadastralnum) {
        if (cadastralnum == null) {
            return null;
        }

        String[] parts = cadastralnum.split(CADASTRAL_NUM_SEPARATOR);

        return parts[parts.length - 1];
    }

    public static String tmbTableName(String schemaName) {
        return TMP_TABLE_PREFIX + schemaName;
    }

    public static boolean hasSameOrdinates(OrdinateOKSOut first, OrdinateOKSOut last) {
        return first != null && last != null
                && first.getX() != null && first.getY() != null
                && last.getX() != null && last.getY() != null
                && first.getX().equals(last.getX())
                && first.getY().equals(last.getY());
    }

    public static boolean hasSameOrdinates(OrdinateBound first, OrdinateBound last) {
        return first != null && last != null
                && first.getX() != null && first.getY() != null
                && last.getX() != null && last.getY() != null
                && first.getX().equals(last.getX())
                && first.getY().equals(last.getY());
    }

    public static boolean hasDifferentOrdinates(OrdinateOKSOut first, OrdinateOKSOut last) {
        return first != null && last != null
                && first.getX() != null && first.getY() != null
                && last.getX() != null && last.getY() != null
                && !(first.getX().equals(last.getX()) && first.getY().equals(last.getY()));
    }

    public static boolean hasDifferentOrdinates(OrdinateBound first, OrdinateBound last) {
        return first != null && last != null
                && first.getX() != null && first.getY() != null
                && last.getX() != null && last.getY() != null
                && !(first.getX().equals(last.getX()) && first.getY().equals(last.getY()));
    }

    public static boolean hasDifferentOrdinates(OrdinateZacrep first, OrdinateZacrep last) {
        return first != null && last != null
                && first.getX() != null && first.getY() != null
                && last.getX() != null && last.getY() != null
                && !(first.getX().equals(last.getX()) && first.getY().equals(last.getY()));
    }

    public static boolean hasSameNum(OrdinateOKSOut first, OrdinateOKSOut last) {
        return first != null && last != null
                && first.getNumGeopoint() != null && last.getNumGeopoint() != null
                && first.getNumGeopoint().equals(last.getNumGeopoint());
    }

    public static boolean hasSameNum(OrdinateBound first, OrdinateBound last) {
        return first != null && last != null
                && first.getNumGeopoint() != null && last.getNumGeopoint() != null
                && first.getNumGeopoint().equals(last.getNumGeopoint());
    }

    public static boolean hasDifferentNum(OrdinateOKSOut first, OrdinateOKSOut last) {
        return first != null && last != null
                && first.getNumGeopoint() != null && last.getNumGeopoint() != null
                && !first.getNumGeopoint().equals(last.getNumGeopoint());
    }

    public static boolean hasDifferentNum(OrdinateBound first, OrdinateBound last) {
        return first != null && last != null
                && first.getNumGeopoint() != null && last.getNumGeopoint() != null
                && !first.getNumGeopoint().equals(last.getNumGeopoint());
    }
}
