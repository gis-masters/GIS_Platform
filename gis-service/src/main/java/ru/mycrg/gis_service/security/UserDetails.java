package ru.mycrg.gis_service.security;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserDetails {
    private Long userId;
    private List<Long> groups = new ArrayList<>();
    private List<OrganizationDetails> organisations = new ArrayList<>();

    public void addGroupId(Long id) {
        this.groups.add(id);
    }

    public void addOrganization(Long id, String name) {
        this.organisations.add(new OrganizationDetails(id, name));
    }
}
