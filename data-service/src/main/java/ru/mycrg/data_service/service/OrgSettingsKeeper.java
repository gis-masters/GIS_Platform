package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.NotFoundException;

import java.util.HashMap;
import java.util.Map;

@Component
public class OrgSettingsKeeper {

    private final Logger log = LoggerFactory.getLogger(OrgSettingsKeeper.class);

    private Map<String, Object> serviceSettings = new HashMap<>();

    public void setServiceSettings(Map<String, Object> serviceSettings) {
        this.serviceSettings = serviceSettings;
    }

    public Map<String, Object> getServiceSettings() {
        return serviceSettings;
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

    public void throwIfNotAllowed(String setting) {
        Object oSetting = serviceSettings.get(setting);
        if (oSetting != null && !Boolean.parseBoolean(oSetting.toString())) {
            log.info("{} notAllowed by settings", oSetting);

            throw new NotFoundException("No message available", new RuntimeException());
        }
    }
}
