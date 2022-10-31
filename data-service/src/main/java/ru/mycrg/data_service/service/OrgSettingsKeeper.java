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
        Object createLibraryItem = serviceSettings.get("createLibraryItem");
        if (createLibraryItem != null && !Boolean.parseBoolean(createLibraryItem.toString())) {
            log.info("CreateLibraryItemNotAllowed by settings");

            throw new NotFoundException("");
        }
    }

    public void throwIfDownloadFileNotAllowed() {
        Object downloadFiles = serviceSettings.get("downloadFiles");
        if (downloadFiles != null && !Boolean.parseBoolean(downloadFiles.toString())) {
            log.info("DownloadFileNotAllowed by settings");

            throw new NotFoundException("");
        }
    }
}
