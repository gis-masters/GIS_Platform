package ru.mycrg.auth_service_contract.dto;

import java.util.HashSet;
import java.util.Set;

public class UserCommonDto {

    private Long id;
    private String login;
    private boolean enabled;
    private String name;
    private String surname;
    private String middleName;
    private String email;
    private String job;
    private String phone;

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    private int authoritiesCount;
    private Set<AuthorityCommonDto> authorities = new HashSet<>();

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return this.login;
    }

    public void setLogin(String login) {
        this.login = login;
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

    public String getSurname() {
        return this.surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
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
