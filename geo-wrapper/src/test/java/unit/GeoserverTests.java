package unit;

import org.junit.Test;
import junit.framework.TestCase;
import ru.mycrg.geoserver_client.services.rule.GeoServerPermissions;
import ru.mycrg.geoserver_client.services.rule.RulesUtil;
import ru.mycrg.geoserver_client.services.rule.RulesService;

import java.util.HashMap;
import java.util.Map;

import static junit.framework.TestCase.assertEquals;

public class GeoserverTests {

    @Test
    public void shouldGetCorrectPermissions() {
        TestCase.assertEquals("workspace.*.a", RulesUtil.buildRule("workspace", "*", GeoServerPermissions.ADMIN));
        assertEquals("workspace.*.r", RulesUtil.buildRule("workspace", "*", GeoServerPermissions.READ));
        assertEquals("workspace.*.w", RulesUtil.buildRule("workspace", "*", GeoServerPermissions.WRITE));
        assertEquals("workspace.*.w", RulesUtil.buildRule("workspace", GeoServerPermissions.WRITE));
        assertEquals("workspace.layer1.w", RulesUtil.buildRule("workspace", "layer1", GeoServerPermissions.WRITE));
    }

    @Test
    public void shouldCorrectAddRestRule() {

        RulesService rulesService = new RulesService();

        Map<String, String> oldRules = new HashMap<>();
        oldRules.put("/**:POST,DELETE,PUT", "ROLE_ADMINISTRATOR,admin_workspace_1");
        oldRules.put("/**:GET", "ROLE_ADMINISTRATOR,admin_workspace_1");

        Map<String, String> result = rulesService.insertNewRole(oldRules, "new_role", null);
        assertEquals("ROLE_ADMINISTRATOR,admin_workspace_1,new_role", result.get("/**:GET"));
        assertEquals("ROLE_ADMINISTRATOR,admin_workspace_1,new_role", result.get("/**:POST,DELETE,PUT"));
    }

}
