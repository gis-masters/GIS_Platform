package ru.mycrg.data_service.util;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.data_service.util.GeometryHandler.isGeometryTypeMatch;

public class GeometryHandlerTest {

    @Test
    public void shouldCorrectDefineThatGeometryTypeIsSame() {
        String sourceGeomType = "ST_Point";
        String targetGeomType = "ST_Point";

        boolean isGeometryTypeMatch = isGeometryTypeMatch(sourceGeomType, targetGeomType);

        assertTrue(isGeometryTypeMatch);
    }

    @Test
    public void shouldCorrectDefineThatGeometryTypeWithMultiPrefixIsSame() {
        String sourceGeomType = "ST_Point";
        String targetGeomType = "ST_Multipoint";

        boolean isGeometryTypeMatch = isGeometryTypeMatch(sourceGeomType, targetGeomType);

        assertTrue(isGeometryTypeMatch);
    }

    @Test
    public void shouldCorrectDefineThatGeometryTypeWithoutSTIsSame() {
        String sourceGeomType = "Point";
        String targetGeomType = "ST_Multipoint";

        boolean isGeometryTypeMatch = isGeometryTypeMatch(sourceGeomType, targetGeomType);

        assertTrue(isGeometryTypeMatch);
    }

    @Test
    public void shouldCorrectDefineThatGeometryTypeIsNotSame() {
        String sourceGeomType = "ST_Polygon";
        String targetGeomType = "ST_Multipoint";

        boolean isGeometryTypeMatch = isGeometryTypeMatch(sourceGeomType, targetGeomType);

        assertFalse(isGeometryTypeMatch);
    }

    @Test
    public void shouldCorrectDefineThatGeometryTypeInvertedIsSame() {
        String sourceGeomType = "ST_Multipoint";
        String targetGeomType = "ST_Point";

        boolean isGeometryTypeMatch = isGeometryTypeMatch(sourceGeomType, targetGeomType);

        assertTrue(isGeometryTypeMatch);
    }
}
