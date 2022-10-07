package ru.mycrg.gis_service.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.gis_service.exceptions.NotFoundException;

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

    public void throwIfCreateProjectNotAllowed() {
        Object createProject = serviceSettings.get("createProject");
        if (createProject != null && !(boolean) createProject) {
            log.info("CreateProjectNotAllowed by settings");

            throw new NotFoundException("");
        }
    }
}
