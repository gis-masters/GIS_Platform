package ru.mycrg.data_service.util;

import org.apache.commons.lang3.StringUtils;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.service.srs.SrsUtils.addAuthority;
import static ru.mycrg.data_service.service.srs.SrsUtils.replaceAuthority;

public class SrsUtilsTest {

    @Test
    public void shouldCorrectlyReplaceAuthority() {
        String wkt = "PROJCS[\"Pulkovo 1963 zone 5\", GEOGCS[\"Pulkovo 1942\", DATUM[\"Pulkovo 1942\", " +
                "SPHEROID[\"Krassowsky 1940\", 6378245.0, 298.3, AUTHORITY[\"EPSG\",\"7024\"]], TOWGS84[43.822, " +
                "-108.842, -119.585, 1.455, -0.761, 0.737, 0.549], AUTHORITY[\"EPSG\",\"6284\"]], PRIMEM[\"Greenwich\"," +
                " 0.0, AUTHORITY[\"EPSG\",\"8901\"]], UNIT[\"degree\", 0.017453292519943295], AXIS[\"Geodetic " +
                "longitude\", EAST], AXIS[\"Geodetic latitude\", NORTH], AUTHORITY[\"EPSG\",\"4284\"]], PROJECTION[" +
                "\"Transverse_Mercator\"], PARAMETER[\"central_meridian\", 35.5], PARAMETER[\"latitude_of_origin\", " +
                "0.0], PARAMETER[\"scale_factor\", 1.0], PARAMETER[\"false_easting\", 5300000.0], PARAMETER[" +
                "\"false_northing\", -9214.692], UNIT[\"m\", 1.0], AXIS[\"x\", EAST], AXIS[\"y\", NORTH], " +
                "AUTHORITY[\"EPSG\",\"314314\"]]";

        String expectedWkt = "PROJCS[\"Pulkovo 1963 zone 5\", GEOGCS[\"Pulkovo 1942\", DATUM[\"Pulkovo 1942\", " +
                "SPHEROID[\"Krassowsky 1940\", 6378245.0, 298.3, AUTHORITY[\"EPSG\",\"7024\"]], TOWGS84[43.822, " +
                "-108.842, -119.585, 1.455, -0.761, 0.737, 0.549], AUTHORITY[\"EPSG\",\"6284\"]], PRIMEM[\"Greenwich\"," +
                " 0.0, AUTHORITY[\"EPSG\",\"8901\"]], UNIT[\"degree\", 0.017453292519943295], AXIS[\"Geodetic " +
                "longitude\", EAST], AXIS[\"Geodetic latitude\", NORTH], AUTHORITY[\"EPSG\",\"4284\"]], PROJECTION[" +
                "\"Transverse_Mercator\"], PARAMETER[\"central_meridian\", 35.5], PARAMETER[\"latitude_of_origin\", " +
                "0.0], PARAMETER[\"scale_factor\", 1.0], PARAMETER[\"false_easting\", 5300000.0], PARAMETER[" +
                "\"false_northing\", -9214.692], UNIT[\"m\", 1.0], AXIS[\"x\", EAST], AXIS[\"y\", NORTH], " +
                "AUTHORITY[\"CRG\",\"123456\"]]";

        assertEquals(expectedWkt, replaceAuthority(wkt, "CRG", 123456).get());
    }

    @Test
    public void shouldCorrectlyAddAuthority() {
        String wkt = "PROJCS[\"Pulkovo 1963 zone 5\", GEOGCS[\"Pulkovo 1942\", DATUM[\"Pulkovo 1942\", " +
                "SPHEROID[\"Krassowsky 1940\", 6378245.0, 298.3, AUTHORITY[\"EPSG\",\"7024\"]], TOWGS84[43.822, " +
                "-108.842, -119.585, 1.455, -0.761, 0.737, 0.549], AUTHORITY[\"EPSG\",\"6284\"]], PRIMEM[\"Greenwich\"," +
                " 0.0, AUTHORITY[\"EPSG\",\"8901\"]], UNIT[\"degree\", 0.017453292519943295], AXIS[\"Geodetic " +
                "longitude\", EAST], AXIS[\"Geodetic latitude\", NORTH], AUTHORITY[\"EPSG\",\"4284\"]], PROJECTION[" +
                "\"Transverse_Mercator\"], PARAMETER[\"central_meridian\", 35.5], PARAMETER[\"latitude_of_origin\", " +
                "0.0], PARAMETER[\"scale_factor\", 1.0], PARAMETER[\"false_easting\", 5300000.0], PARAMETER[\"" +
                "false_northing\", -9214.692], UNIT[\"m\", 1.0], AXIS[\"x\", EAST], AXIS[\"y\", NORTH]]";

        String expectedWkt = "PROJCS[\"Pulkovo 1963 zone 5\", GEOGCS[\"Pulkovo 1942\", DATUM[\"Pulkovo 1942\", " +
                "SPHEROID[\"Krassowsky 1940\", 6378245.0, 298.3, AUTHORITY[\"EPSG\",\"7024\"]], TOWGS84[43.822, " +
                "-108.842, -119.585, 1.455, -0.761, 0.737, 0.549], AUTHORITY[\"EPSG\",\"6284\"]], PRIMEM[\"Greenwich\"," +
                " 0.0, AUTHORITY[\"EPSG\",\"8901\"]], UNIT[\"degree\", 0.017453292519943295], AXIS[\"Geodetic " +
                "longitude\", EAST], AXIS[\"Geodetic latitude\", NORTH], AUTHORITY[\"EPSG\",\"4284\"]], PROJECTION[" +
                "\"Transverse_Mercator\"], PARAMETER[\"central_meridian\", 35.5], PARAMETER[\"latitude_of_origin\", " +
                "0.0], PARAMETER[\"scale_factor\", 1.0], PARAMETER[\"false_easting\", 5300000.0], PARAMETER[\"" +
                "false_northing\", -9214.692], UNIT[\"m\", 1.0], AXIS[\"x\", EAST], AXIS[\"y\", NORTH], " +
                "AUTHORITY[\"CRG\",\"250005\"]]";

        assertEquals(expectedWkt, addAuthority(wkt, "CRG", 250005).get());
    }

    @Test
    public void shouldCleanSrsText() {
        String sourceString = "PROJCS[\"Pulkovo / Gauss-Kruger zone 6\", \n" +
                "  GEOGCS[\"Pulkovo 1942\", \n" +
                "  AUTHORITY[\"EPSG\",\"28406\"]]\n" +
                "\n";

        assertEquals(
                "PROJCS[\"Pulkovo / Gauss-Kruger zone 6\", GEOGCS[\"Pulkovo 1942\", AUTHORITY[\"EPSG\",\"28406\"]]",
                StringUtils.normalizeSpace(sourceString));
    }
}
