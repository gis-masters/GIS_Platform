package unit;

import junit.framework.TestCase;
import org.junit.Test;
import ru.geoserver.service.GeoServerPermissions;
import ru.geoserver.service.GeoServerUtil;

import static junit.framework.TestCase.assertEquals;

public class GeoserverTests {

    @Test
    public void shouldGetCorrectPermissions() {
        TestCase.assertEquals("workspace.*.a", GeoServerUtil.buildRule("workspace", "*", GeoServerPermissions.ADMIN));
        assertEquals("workspace.*.r", GeoServerUtil.buildRule("workspace", "*", GeoServerPermissions.READ));
        assertEquals("workspace.*.w", GeoServerUtil.buildRule("workspace", "*", GeoServerPermissions.WRITE));
        assertEquals("workspace.*.w", GeoServerUtil.buildRule("workspace", GeoServerPermissions.WRITE));
        assertEquals("workspace.layer1.w", GeoServerUtil.buildRule("workspace", "layer1", GeoServerPermissions.WRITE));
    }
}
