package ru.mycrg.gis_service.security;

import java.util.ArrayList;
import java.util.List;

public class UserDetails {

    private Long userId;
    private List<Long> groups = new ArrayList<>();
    private List<OrganizationDetails> organisations = new ArrayList<>();

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getGroups() {
        return groups;
    }

    public void setGroups(List<Long> groups) {
        this.groups = groups;
    }

    public List<OrganizationDetails> getOrganisations() {
        return organisations;
    }

    public void setOrganisations(List<OrganizationDetails> organisations) {
        this.organisations = organisations;
    }

    public void addGroupId(Long id) {
        this.groups.add(id);
    }

    public void addOrganization(Long id, String name) {
        this.organisations.add(new OrganizationDetails(id, name));
    }
}
