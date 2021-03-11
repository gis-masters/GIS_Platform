package ru.mycrg.data_service.security;

import java.util.ArrayList;
import java.util.List;

public class UserDetails {

    private Long userId;
    private List<Long> groups = new ArrayList<>();

    public UserDetails() {
        // Required
    }

    public void addGroupId(Long id) {
        this.groups.add(id);
    }

    public Long getUserId() {
        return this.userId;
    }

    public List<Long> getGroups() {
        return this.groups;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setGroups(List<Long> groups) {
        this.groups = groups;
    }
}
