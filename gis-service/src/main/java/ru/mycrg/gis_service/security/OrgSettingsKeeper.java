package ru.mycrg.gis_service.security;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.exceptions.NotFoundException;

import java.util.HashMap;
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

    public void throwIfCreateProjectNotAllowed() {
        Object createProject = getCurrentOrgSettings().get("createProject");
        if (createProject != null && !Boolean.parseBoolean(createProject.toString())) {
            log.info("CreateProjectNotAllowed by settings");

            throw new NotFoundException("");
        }
    }

    @NotNull
    private Map<String, Object> getCurrentOrgSettings() {
        OrgSettingsUpdatedEvent orgSettings = this.orgSettings.get(authenticationFacade.getOrganizationId());
        if (orgSettings == null || orgSettings.getSettings() == null) {
            throw new GisServiceException("Не удалось считать настройки организации.");
        }

        return orgSettings.getSettings();
    }
}
