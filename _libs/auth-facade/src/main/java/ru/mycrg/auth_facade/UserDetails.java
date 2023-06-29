package ru.mycrg.auth_facade;

import java.util.ArrayList;
import java.util.List;

public class UserDetails {

    private Long userId;
    private List<Long> groups = new ArrayList<>();
    private List<Long> minions = new ArrayList<>();
    private String crgLogin;

    public UserDetails() {
        // Required
    }

    public Long getUserId() {
        return this.userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void addGroupId(Long id) {
        this.groups.add(id);
    }

    public List<Long> getGroups() {
        return this.groups;
    }

    public void setGroups(List<Long> groups) {
        this.groups = groups;
    }

    public String getCrgLogin() {
        return crgLogin;
    }

    public void setCrgLogin(String crgLogin) {
        this.crgLogin = crgLogin;
    }

    public List<Long> getMinions() {
        return minions;
    }

    public void setMinions(List<Long> minions) {
        this.minions = minions;
    }

    public void addMinionId(Long minionId) {
        this.minions.add(minionId);
    }
}
