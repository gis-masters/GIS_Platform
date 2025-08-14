package ru.mycrg.auth_service.service.organization.settings;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.common_contracts.specialization.Settings;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.auth_service.service.organization.settings.OrgSettingsSchemaHolder.DEFAULT_EPSG;
import static ru.mycrg.auth_service.service.organization.settings.OrgSettingsSchemaHolder.DEFAULT_FAVORITES_EPSG;

public class SpecializationSettingsHandler {

    @NotNull
    public static Map<String, Object> fillSettingsBySpecialization(@Nullable Settings settings,
                                                                   Map<String, Object> initialSettings) {
        Map<String, Object> result = new HashMap<>();
        if (settings == null) {
            if (initialSettings != null) {
                result = new HashMap<>(initialSettings);
            }

            return result;
        }

        // Tags
        result.put("tags", settings.getTags() != null && !settings.getTags().isEmpty()
                ? settings.getTags()
                : "[]");

        // default_epsg
        result.put("default_epsg", (settings.getDefaultEpsg() != null)
                ? settings.getDefaultEpsg()
                : DEFAULT_EPSG);

        // favorites_epsg
        result.put("favorites_epsg",
                   settings.getFavoritesEpsg() != null && !settings.getFavoritesEpsg().isEmpty()
                           ? settings.getFavoritesEpsg()
                           : List.of(DEFAULT_FAVORITES_EPSG));

        // Storage size
        result.put("storageSize", settings.getStorageSize() != null ? settings.getStorageSize() : 0);

        // Boolean settings - если настройка не упомянута она выключена
        result.put("reestrs", settings.getReestrs() != null && settings.getReestrs());
        result.put("sedDialog", settings.getSedDialog() != null && settings.getSedDialog());
        result.put("downloadXml", settings.getDownloadXml() != null && settings.getDownloadXml());
        result.put("createProject", settings.getCreateProject() != null && settings.getCreateProject());
        result.put("downloadFiles", settings.getDownloadFiles() != null && settings.getDownloadFiles());
        result.put("taskManagement", settings.getTaskManagement() != null && settings.getTaskManagement());
        result.put("showPermissions", settings.getShowPermissions() != null && settings.getShowPermissions());
        result.put("editProjectLayer", settings.getEditProjectLayer() != null && settings.getEditProjectLayer());
        result.put("createLibraryItem", settings.getCreateLibraryItem() != null && settings.getCreateLibraryItem());

        result.put("importShp", settings.getImportShp() != null && settings.getImportShp());
        result.put("downloadGml", settings.getDownloadGml() != null && settings.getDownloadGml());
        result.put("viewBugReport", settings.getViewBugReport() != null && settings.getViewBugReport());
        result.put("viewDocumentLibrary",
                   settings.getViewDocumentLibrary() != null && settings.getViewDocumentLibrary());
        result.put("viewServicesCalculator",
                   settings.getViewServicesCalculator() != null && settings.getViewServicesCalculator());

        return result;
    }
}
