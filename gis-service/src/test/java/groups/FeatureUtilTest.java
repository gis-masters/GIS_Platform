package groups;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static ru.mycrg.gis_service.service.geoserver.FeatureUtil.buildGeoserverFeatureName;

class FeatureUtilTest {

    @Test
    void shouldBuildGeoserverFeatureNameAsExpected() {
        assertEquals("", buildGeoserverFeatureName(null, null, null));
        assertEquals("", buildGeoserverFeatureName(null, null, "EPSG:2857"));
        assertEquals("_tableName", buildGeoserverFeatureName(null, "tableName", null));
        assertEquals("314_tableName", buildGeoserverFeatureName(314L, "tableName", ""));
        assertEquals("314_tableName", buildGeoserverFeatureName(314L, "tableName", "incorrectEPSG"));
        assertEquals("314_tableName", buildGeoserverFeatureName(314L, "tableName", "incorrect:EPSG"));
        assertEquals("314_tableName_3857", buildGeoserverFeatureName(314L, "tableName", "EPSG:3857"));
        assertEquals("314_tableName_3857", buildGeoserverFeatureName(314L, "tableName_3857", "EPSG:3857"));
        assertEquals("314_tableName_3857", buildGeoserverFeatureName(314L, "tableName_3857", "EPSG:"));
        assertEquals("314_tableName_3857_28406", buildGeoserverFeatureName(314L, "tableName_3857", "EPSG:28406"));
    }
}
