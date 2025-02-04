package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class OrgSettingsKeeper {

    private final Logger log = LoggerFactory.getLogger(OrgSettingsKeeper.class);

    private final IAuthenticationFacade authenticationFacade;
    private final Map<Long, OrgSettingsUpdatedEvent> orgSettings = new HashMap<>();

    public OrgSettingsKeeper(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public void updateOrgSetting(OrgSettingsUpdatedEvent newOrgSettings) {
        this.orgSettings.put(newOrgSettings.getOrgId(), newOrgSettings);
    }

    public void throwIfCreateLibraryItemNotAllowed() {
        throwIfNotAllowed("createLibraryItem");
    }

    public void throwIfDownloadFileNotAllowed() {
        throwIfNotAllowed("downloadFiles");
    }

    public void throwIfReestrsNotAllowed() {
        throwIfNotAllowed("reestrs");
    }

    /**
     * Ограничение дискового пространства для организации. Значение -1 означает что ограничений нет.
     */
    public int getStorageSize() {
        Object o = getCurrentOrgSettings().get("storageSize");
        if (o == null) {
            return -1;
        } else {
            int size = Integer.parseInt(o.toString());
            if (size < 0) {
                return -1;
            }

            return size;
        }
    }

    public boolean isTagAllowed(String tag) {
        Map<String, Object> orgSettings = getCurrentOrgSettings();
        if (!orgSettings.containsKey("tags")) {
            return false;
        }

        List<String> tags = (List<String>) orgSettings.get("tags");
        if (tags.isEmpty()) {
            return false;
        }

        if (tags.contains(tag)) {
            return true;
        }

        return false;
    }

    private void throwIfNotAllowed(String settingKey) {
        Object oSetting = getCurrentOrgSettings().get(settingKey);
        if (oSetting != null && !Boolean.parseBoolean(oSetting.toString())) {
            log.info("{} notAllowed by settings", oSetting);

            throw new NotFoundException("No message available", new RuntimeException());
        }
    }

    @NotNull
    private Map<String, Object> getCurrentOrgSettings() {
        Long orgId = authenticationFacade.getOrganizationId();
        OrgSettingsUpdatedEvent orgSettings = this.orgSettings.get(orgId);
        if (orgSettings == null || orgSettings.getSettings() == null) {
            throw new DataServiceException("Не удалось считать настройки организации: " + orgId);
        }

        return orgSettings.getSettings();
    }
}
