package ru.mycrg.auth_service.service.organization.settings;

import org.junit.jupiter.api.Test;
import ru.mycrg.common_contracts.specialization.Settings;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.mycrg.auth_service.service.organization.settings.SpecializationSettingsHandler.fillSettingsBySpecialization;

public class SpecializationSettingsUtilTest {

    public static final int EXPECTED_NUMBER_OF_SETTINGS = 18;

    @Test
    void shouldCorrectHandleNullable() {
        assertTrue(fillSettingsBySpecialization(null, null).isEmpty());
        assertTrue(fillSettingsBySpecialization(null, new HashMap<>()).isEmpty());
    }

    @Test
    void shouldKeepInitialSettings() {
        Map<String, Object> initialSettings = Map.of("tags", "[]",
                                                     "someOtherKey", "someValue");
        Map<String, Object> result = fillSettingsBySpecialization(null, initialSettings);

        assertTrue(result.containsKey("tags"));
        assertTrue(result.containsKey("someOtherKey"));
    }

    /**
     * Специализации считаем главнее, чем начальные настройки организации.
     * <p>
     * Поэтому если организация создаётся без специализации или в специализации не указаны настройки, то все настройки
     * должны быть выключены по-умолчанию. И в них не должно быть лишних, не известных ключей (мусор нам ни к чему).
     */
    @Test
    void settingsBySpecializationMoreImportant() {
        Map<String, Object> initialSettings = Map.of("tags", "[\"someTag\"]",
                                                     "someOtherKey", "someValue",
                                                     "downloadXml", TRUE);
        Map<String, Object> result = fillSettingsBySpecialization(new Settings(), initialSettings);

        assertEquals(EXPECTED_NUMBER_OF_SETTINGS, result.size());
        assertEquals("[]", result.get("tags"));
        assertEquals(FALSE, result.get("reestrs"));
        assertEquals(FALSE, result.get("sedDialog"));
        assertEquals(FALSE, result.get("downloadXml"));
        assertEquals(FALSE, result.get("createProject"));
        assertEquals(FALSE, result.get("downloadFiles"));
        assertEquals(FALSE, result.get("taskManagement"));
        assertEquals(FALSE, result.get("editProjectLayer"));
        assertEquals(FALSE, result.get("createLibraryItem"));
        assertEquals(0, result.get("storageSize"));
    }

    @Test
    void shouldCorrectFillSettingsBySpecialization() {
        Map<String, Object> initialSettings = Map.of("tags", "[\"someTag\"]",
                                                     "someOtherKey", "someValue",
                                                     "downloadXml", TRUE);

        Settings settingsBySpecialization = new Settings();
        settingsBySpecialization.setCreateProject(TRUE);
        settingsBySpecialization.setDownloadFiles(TRUE);
        settingsBySpecialization.setTags(List.of("firstTag", "secondTag"));
        settingsBySpecialization.setStorageSize(20);

        Map<String, Object> result = fillSettingsBySpecialization(settingsBySpecialization, initialSettings);

        assertEquals(EXPECTED_NUMBER_OF_SETTINGS, result.size());
        assertEquals("[firstTag, secondTag]", result.get("tags").toString());
        assertEquals(FALSE, result.get("reestrs"));
        assertEquals(FALSE, result.get("sedDialog"));
        assertEquals(FALSE, result.get("downloadXml"));
        assertEquals(TRUE, result.get("createProject"));
        assertEquals(TRUE, result.get("downloadFiles"));
        assertEquals(FALSE, result.get("taskManagement"));
        assertEquals(FALSE, result.get("editProjectLayer"));
        assertEquals(FALSE, result.get("createLibraryItem"));
        assertEquals(20, result.get("storageSize"));
    }
}
