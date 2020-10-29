package ru.mycrg.auth_service_contract.dto;

import java.util.HashSet;
import java.util.Set;

public class UserCommonDto {

    private Long id;
    private String username;
    private boolean enabled;
    private String name;
    private String surName;
    private String email;
    private int authoritiesCount;
    private Set<AuthorityCommonDto> authorities = new HashSet<>();

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isEnabled() {
        return this.enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurName() {
        return this.surName;
    }

    public void setSurName(String surName) {
        this.surName = surName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getAuthoritiesCount() {
        return this.authoritiesCount;
    }

    public void setAuthoritiesCount(int authoritiesCount) {
        this.authoritiesCount = authoritiesCount;
    }

    public Set<AuthorityCommonDto> getAuthorities() {
        return this.authorities;
    }

    public void setAuthorities(Set<AuthorityCommonDto> authorities) {
        this.authorities = authorities;
    }
}
