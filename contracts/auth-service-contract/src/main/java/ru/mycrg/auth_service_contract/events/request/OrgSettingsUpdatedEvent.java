package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.Map;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.ORG_SETTINGS_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.ORG_SETTINGS_KEY;

public class OrgSettingsUpdatedEvent extends DefaultMessageBusRequestEvent {

    private Long orgId;
    private Map<String, Object> settings;

    public OrgSettingsUpdatedEvent() {
        super(UUID.randomUUID(), ORG_SETTINGS_FANOUT, ORG_SETTINGS_KEY);
    }

    public OrgSettingsUpdatedEvent(Long orgId, Map<String, Object> settings) {
        super(UUID.randomUUID(), ORG_SETTINGS_FANOUT, ORG_SETTINGS_KEY);

        this.orgId = orgId;
        this.settings = settings;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Map<String, Object> getSettings() {
        return settings;
    }

    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }

    @Override
    public String toString() {
        return "{" +
                "\"orgId\":" + (orgId == null ? "null" : "\"" + orgId + "\"") + ", " +
                "\"settings\":" + (settings == null ? "null" : "\"" + settings + "\"") +
                "}";
    }
}
