package ru.mycrg.auth_service.service.organization.settings;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static ru.mycrg.auth_service.service.organization.settings.SettingsUtil.*;

public class MergeSettingsTest {

    @Test
    void mergeEmptySettings() {
        assertTrue(mergeSettings(new HashMap<>(), new HashMap<>()).isEmpty());
    }

    @Test
    void globalSettingsFalseByDefault() {
        Map<String, Object> orgSettings = new HashMap<>();
        orgSettings.put("s1", true);
        orgSettings.put("s2", false);

        Map<String, Object> result = mergeSettings(new HashMap<>(), orgSettings);

        assertFalse(result.containsKey("s1"));
        assertFalse(result.containsKey("s2"));
        assertFalse(result.containsKey("other_"));
    }

    @Test
    void mergeGlobalSettingsAndOrgSettings() {
        Map<String, Object> globalSettings = new HashMap<>();
        globalSettings.put("s1", true);
        globalSettings.put("s2", true);
        globalSettings.put("s3", false);

        Map<String, Object> orgSettings = new HashMap<>();
        orgSettings.put("s1", false);
        orgSettings.put("s2", true);
        orgSettings.put("s3", true);

        Map<String, Object> result = mergeSettings(globalSettings, orgSettings);

        assertFalse((Boolean) result.get("s1"));
        assertTrue((Boolean) result.get("s2"));
        assertFalse((Boolean) result.get("s3"));
    }
}
