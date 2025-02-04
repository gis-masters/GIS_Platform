package ru.mycrg.auth_service_contract.dto;

import java.util.Map;

public class OrgSettingsResponseDto {

    private Long id;
    private String name;
    private Map<String, Object> system;
    private Map<String, Object> organization;

    public OrgSettingsResponseDto() {
        // Required
    }

    public OrgSettingsResponseDto(Long id, Map<String, Object> system, Map<String, Object> organization) {
        this(id, null, system, organization);
    }

    public OrgSettingsResponseDto(Long id, String name, Map<String, Object> system, Map<String, Object> organization) {
        this.id = id;
        this.system = system;
        this.name = name;
        this.organization = organization;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Map<String, Object> getSystem() {
        return system;
    }

    public void setSystem(Map<String, Object> system) {
        this.system = system;
    }

    public Map<String, Object> getOrganization() {
        return organization;
    }

    public void setOrganization(Map<String, Object> organization) {
        this.organization = organization;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
