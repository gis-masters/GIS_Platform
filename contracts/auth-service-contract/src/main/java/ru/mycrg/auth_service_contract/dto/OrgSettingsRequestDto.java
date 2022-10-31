package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import java.util.Map;
import java.util.Objects;

public class OrgSettingsRequestDto {

    @Min(-2)
    private Long id;

    @NotEmpty
    private Map<String, Object> settings;

    public OrgSettingsRequestDto() {
        // Required
    }

    public OrgSettingsRequestDto(Long id) {
        this.id = id;
    }

    public OrgSettingsRequestDto(Long id, Map<String, Object> settings) {
        this.id = id;
        this.settings = settings;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Map<String, Object> getSettings() {
        return settings;
    }

    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrgSettingsRequestDto)) {
            return false;
        }
        OrgSettingsRequestDto that = (OrgSettingsRequestDto) o;
        return getId().equals(that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"settings\":" + (settings == null ? "null" : "\"" + settings + "\"") +
                "}";
    }
}
