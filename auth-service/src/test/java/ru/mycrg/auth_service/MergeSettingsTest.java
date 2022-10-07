package ru.mycrg.auth_service;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static ru.mycrg.auth_service.util.SettingsHandler.*;

class MergeSettingsTest {

    @Test
    void mergeEmptySettings() {
        assertTrue(mergeSettings(new HashMap<>(), new HashMap<>()).isEmpty());
    }

    @Test
    void useOrgSettingsThenGlobalEmpty() {
        Map<String, Object> orgSettings = new HashMap<>();
        orgSettings.put("some", true);
        orgSettings.put("other", false);

        Map<String, Object> result = mergeSettings(new HashMap<>(), orgSettings);

        assertTrue(result.containsKey("some"));
        assertTrue(result.containsKey("other"));
        assertFalse(result.containsKey("other_"));
    }

    @Test
    void globalSettingsMorePowerful() {
        Map<String, Object> orgSettings = new HashMap<>();
        orgSettings.put("some", true);
        orgSettings.put("other", true);
        orgSettings.put("other3", true);

        Map<String, Object> globalSettings = new HashMap<>();
        orgSettings.put("some", false);
        orgSettings.put("other", false);
        orgSettings.put("other2", true);

        Map<String, Object> result = mergeSettings(globalSettings, orgSettings);

        assertFalse((Boolean) result.get("some"));
        assertFalse((Boolean) result.get("other"));
        assertTrue((Boolean) result.get("other2"));
        assertTrue((Boolean) result.get("other3"));
    }
}
