package ru.mycrg.data_service.util;

import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

public class GeometryHandler {

    private GeometryHandler() {
        throw new IllegalStateException("Utility class");
    }

    public static boolean isGeometryTypeMatch(String sourceGeomType, String targetGeomType) {
        String[] splitSourceGeomType = sourceGeomType.split("ST_");
        String[] splitTargetGeomType = targetGeomType.split("ST_");
        sourceGeomType = splitSourceGeomType.length > 1
                ? splitSourceGeomType[1]
                : splitSourceGeomType[0];
        targetGeomType = splitTargetGeomType.length > 1
                ? splitTargetGeomType[1]
                : splitTargetGeomType[0];

        if (containsIgnoreCase(sourceGeomType, targetGeomType)) {
            return true;
        }

        return containsIgnoreCase(targetGeomType, sourceGeomType);
    }
}
