package ru.mycrg.common_utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class ServiceSettings {

    private Map<String, Object> settings;

    public ServiceSettings() {
        this.settings = new HashMap<>();
    }

    public ServiceSettings(Map<String, Object> settings) {
        this.settings = settings;
    }

    public Map<String, Object> getSettings() {
        return settings;
    }

    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }

    public Set<String> getNames() {
        return settings.keySet();
    }
}
