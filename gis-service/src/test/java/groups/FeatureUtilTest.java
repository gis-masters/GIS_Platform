package groups;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static ru.mycrg.gis_service.service.geoserver.FeatureUtil.buildGeoserverFeatureName;

class FeatureUtilTest {

    @Test
    void shouldBuildGeoserverFeatureNameAsExpected() {
        assertEquals("", buildGeoserverFeatureName(null, null));
        assertEquals("", buildGeoserverFeatureName(null, "EPSG:2857"));
        assertEquals("tableName", buildGeoserverFeatureName("tableName", null));
        assertEquals("tableName", buildGeoserverFeatureName("tableName", ""));
        assertEquals("tableName", buildGeoserverFeatureName("tableName", "incorrectEPSG"));
        assertEquals("tableName", buildGeoserverFeatureName("tableName", "incorrect:EPSG"));
        assertEquals("tableName__3857", buildGeoserverFeatureName("tableName", "EPSG:3857"));
        assertEquals("tableName_3857__3857", buildGeoserverFeatureName("tableName_3857", "EPSG:3857"));
        assertEquals("tableName_3857", buildGeoserverFeatureName("tableName_3857", "EPSG:"));
        assertEquals("tableName_3857__28406", buildGeoserverFeatureName("tableName_3857", "EPSG:28406"));
    }
}
