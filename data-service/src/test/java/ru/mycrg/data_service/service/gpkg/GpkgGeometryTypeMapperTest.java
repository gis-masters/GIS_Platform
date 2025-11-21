package ru.mycrg.data_service.service.gpkg;

import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import ru.mycrg.data_service_contract.enums.GeometryType;

public class GpkgGeometryTypeMapperTest {

    GpkgGeometryTypeMapper mapper = new GpkgGeometryTypeMapper();

    @Test
    public void emptyString() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType(""));
    }

    @Test
    public void nullString() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType(null));
    }

    @Test
    public void badData() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("invalid"));
    }

    @Test
    public void brokenData() {
        Assertions.assertThrows(IllegalArgumentException.class,
                                () -> mapper.mapType("!@$%^&*()_+№;%:?()___++<>||| 😀 🐰'~`"));

        Assertions.assertThrows(IllegalArgumentException.class,
                                () -> mapper.mapType("点 线 多边形 圆 😀"));

        Assertions.assertThrows(IllegalArgumentException.class,
                                () -> mapper.mapType("GEOMÉTRÍA_Δ_точка_點"));

        Assertions.assertThrows(IllegalArgumentException.class,
                                () -> mapper.mapType("🧪📐🌍🔥💥"));

        Assertions.assertThrows(IllegalArgumentException.class,
                                () -> mapper.mapType("LINE\u200BSTRING\u200D_POLY\u00ADGON"));

        Assertions.assertThrows(IllegalArgumentException.class,
                                () -> mapper.mapType("LINE\tSTRING\nPOLYGON\r\n"));

        Assertions.assertThrows(IllegalArgumentException.class,
                                () -> mapper.mapType("???? 測試測試測試 #####@@@@@" +
                                                             "абвгдёжзий漢字かなカナ🦊🦄🐉<<<>>>|||$$$%%%"));
    }

    @Test
    public void correctDataPoint() {
        Assertions.assertEquals(GeometryType.POINT, mapper.mapType("POINT"));
    }

    @Test
    public void correctDataLineString() {
        Assertions.assertEquals(GeometryType.MULTI_LINE_STRING, mapper.mapType("LINESTRING"));
    }

    @Test
    public void correctDataPolygon() {
        Assertions.assertEquals(GeometryType.MULTI_POLYGON, mapper.mapType("POLYGON"));
    }

    @Test
    public void correctDataMultiPoint() {
        Assertions.assertEquals(GeometryType.POINT, mapper.mapType("MULTIPOINT"));
    }

    @Test
    public void correctDataMultiLineString() {
        Assertions.assertEquals(GeometryType.MULTI_LINE_STRING, mapper.mapType("MULTILINESTRING"));
    }

    @Test
    public void correctDataMultiPolygon() {
        Assertions.assertEquals(GeometryType.MULTI_POLYGON, mapper.mapType("MULTIPOLYGON"));
    }

    @Test
    public void correctDataMultiPolygonInverted() {
        Assertions.assertNotEquals(GeometryType.POINT, mapper.mapType("MULTIPOLYGON"));
        Assertions.assertNotEquals(GeometryType.MULTI_LINE_STRING, mapper.mapType("MULTIPOLYGON"));
    }

    @Test
    public void correctUnsupportedGeometryTypes() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("GEOMETRY"));
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("GEOMETRYCOLLECTION"));
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("CIRCULARSTRING"));
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("COMPOUNDCURVE"));
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("CURVEPOLYGON"));
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("MULTICURVE"));
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("MULTISURFACE"));
        Assertions.assertThrows(IllegalArgumentException.class, () -> mapper.mapType("MULTISURFACE"));
    }
}
