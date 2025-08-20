package unit;

import org.junit.Test;
import ru.mycrg.geoserver_client.services.rule.RulesUtil;

import java.util.HashMap;
import java.util.Map;

import static junit.framework.TestCase.assertEquals;
import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.deleteRole;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.insertNewRole;

public class GeoserverTests {

    @Test
    public void shouldGetCorrectPermissions() {
        assertEquals("workspace.*.w", RulesUtil.buildRule("workspace", WRITE));
        assertEquals("workspace.*.a", RulesUtil.buildRule("workspace", "*", ADMIN));
        assertEquals("workspace.*.r", RulesUtil.buildRule("workspace", "*", READ));
        assertEquals("workspace.*.w", RulesUtil.buildRule("workspace", "*", WRITE));
        assertEquals("workspace.layer1.w", RulesUtil.buildRule("workspace", "layer1", WRITE));
    }

    @Test
    public void shouldCorrectAddRestRule() {
        // Assert
        Map<String, String> oldRules = new HashMap<String, String>() {{
            put("/**:POST,DELETE,PUT", "ROLE_ADMINISTRATOR,admin_workspace_1");
            put("/**:GET", "ROLE_ADMINISTRATOR,admin_workspace_1");
        }};

        // Act
        Map<String, String> result = insertNewRole(oldRules, "new_role", null);

        // Assets
        assertEquals("ROLE_ADMINISTRATOR,admin_workspace_1,new_role", result.get("/**:GET"));
        assertEquals("ROLE_ADMINISTRATOR,admin_workspace_1,new_role", result.get("/**:POST,DELETE,PUT"));
    }

    @Test
    public void shouldCorrectDeleteRestRule() {
        // Assert
        Map<String, String> oldRules = new HashMap<String, String>() {{
            put("/**:POST,DELETE,PUT", "ROLE_ADMIN,admin_1,admin_2,admin_4,admin_37,admin_38,admin_39,admin_40");
            put("/**:GET", "ROLE_ADMIN,admin_1,admin_2,admin_4,admin_37,admin_38,admin_39,admin_40");
        }};

        // Act
        Map<String, String> result1 = deleteRole(oldRules, "admin_4");
        Map<String, String> result2 = deleteRole(result1, "admin_40");
        Map<String, String> result3 = deleteRole(result2, "not_exist_role");

        // Assets
        assertEquals("ROLE_ADMIN,admin_1,admin_2,admin_37,admin_38,admin_39,admin_40", result1.get("/**:GET"));
        assertEquals("ROLE_ADMIN,admin_1,admin_2,admin_37,admin_38,admin_39", result2.get("/**:GET"));
        assertEquals("ROLE_ADMIN,admin_1,admin_2,admin_37,admin_38,admin_39", result2.get("/**:POST,DELETE,PUT"));
        assertEquals("ROLE_ADMIN,admin_1,admin_2,admin_37,admin_38,admin_39", result3.get("/**:POST,DELETE,PUT"));
    }
}
