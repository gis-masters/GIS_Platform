package groups;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static ru.mycrg.gis_service.service.geoserver.FeatureUtil.buildGeoserverFeatureName;

class FeatureUtilTest {

    @Test
    void shouldBuildGeoserverFeatureNameAsExpected() {
        assertEquals("", buildGeoserverFeatureName(null, null));
        assertEquals("", buildGeoserverFeatureName(null, "EPSG:2857"));
        assertEquals("resourceId", buildGeoserverFeatureName("resourceId", null));
        assertEquals("resourceId", buildGeoserverFeatureName("resourceId", ""));
        assertEquals("resourceId", buildGeoserverFeatureName("resourceId", "incorrectEPSG"));
        assertEquals("resourceId", buildGeoserverFeatureName("resourceId", "incorrect:EPSG"));
        assertEquals("resourceId__3857", buildGeoserverFeatureName("resourceId", "EPSG:3857"));
        assertEquals("resourceId_3857__3857", buildGeoserverFeatureName("resourceId_3857", "EPSG:3857"));
        assertEquals("resourceId_3857", buildGeoserverFeatureName("resourceId_3857", "EPSG:"));
        assertEquals("resourceId_3857__28406", buildGeoserverFeatureName("resourceId_3857", "EPSG:28406"));
    }
}
