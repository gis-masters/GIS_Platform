package ru.mycrg.auth_service_contract.dto;

import java.util.Arrays;
import java.util.Set;

public class UserInfoModel {

    private Long id;
    private String name;
    private String login;
    private String geoserverLogin;
    private String middleName;
    private String surname;
    private String job;
    private String phone;
    private String email;
    private boolean enabled;
    private Set<String> authorities;
    private String createdAt;
    private String lastModified;

    private String orgName;
    private Long orgId;
    private Short version;

    public UserInfoModel() {
        // Test required
    }

    public UserInfoModel(String name) {
        this.name = name;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public UserInfoModel(Long id, String name, String login, String surname, String email, boolean enabled,
                         Set<String> authorities, String createdAt, String orgName, Long orgId,
                         String middleName, String job, String phone, String geoserverLogin,
                         String lastModified, Short version) {
        this.id = id;
        this.name = name;
        this.login = login;
        this.surname = surname;
        this.email = email;
        this.enabled = enabled;
        this.authorities = authorities;
        this.createdAt = createdAt;
        this.lastModified = lastModified;
        this.orgName = orgName;
        this.orgId = orgId;
        this.middleName = middleName;
        this.job = job;
        this.phone = phone;
        this.geoserverLogin = geoserverLogin;
        this.version = version;
    }

    public static UserInfoModelBuilder builder() {
        return new UserInfoModelBuilder();
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getJob() {
        return job;
    }

    public String getPhone() {
        return phone;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLogin() {
        return login;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getOrgName() {
        return orgName;
    }

    public Long getOrgId() {
        return orgId;
    }

    public String getGeoserverLogin() {
        return geoserverLogin;
    }

    public String getLastModified() {
        return lastModified;
    }

    public Short getVersion() {
        return version;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setGeoserverLogin(String geoserverLogin) {
        this.geoserverLogin = geoserverLogin;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public void setVersion(Short version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"login\":" + (login == null ? "null" : "\"" + login + "\"") + ", " +
                "\"geoserverLogin\":" + (geoserverLogin == null ? "null" : "\"" + geoserverLogin + "\"") + ", " +
                "\"middleName\":" + (middleName == null ? "null" : "\"" + middleName + "\"") + ", " +
                "\"surname\":" + (surname == null ? "null" : "\"" + surname + "\"") + ", " +
                "\"job\":" + (job == null ? "null" : "\"" + job + "\"") + ", " +
                "\"phone\":" + (phone == null ? "null" : "\"" + phone + "\"") + ", " +
                "\"email\":" + (email == null ? "null" : "\"" + email + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"authorities\":" + (authorities == null ? "null" : Arrays.toString(authorities.toArray())) + ", " +
                "\"createdAt\":" + (createdAt == null ? "null" : "\"" + createdAt + "\"") + ", " +
                "\"lastModified\":" + (lastModified == null ? "null" : "\"" + lastModified + "\"") + ", " +
                "\"orgName\":" + (orgName == null ? "null" : "\"" + orgName + "\"") + ", " +
                "\"orgId\":" + (orgId == null ? "null" : "\"" + orgId + "\"") + ", " +
                "\"version\":" + (version == null ? "null" : "\"" + version + "\"") +
                "}";
    }

    public static class UserInfoModelBuilder {

        private Long id;
        private String name;
        private String login;
        private String surname;
        private String email;
        private boolean enabled;
        private Set<String> authorities;
        private String createdAt;
        private String lastModified;
        private String orgName;
        private Long orgId;
        private String middleName;
        private String job;
        private String phone;
        private String geoserverLogin;
        private Short version;

        UserInfoModelBuilder() {
        }

        public UserInfoModelBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserInfoModelBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserInfoModelBuilder login(String login) {
            this.login = login;
            return this;
        }

        public UserInfoModelBuilder geoserverLogin(String geoserverLogin) {
            this.geoserverLogin = geoserverLogin;
            return this;
        }

        public UserInfoModelBuilder surname(String surname) {
            this.surname = surname;
            return this;
        }

        public UserInfoModelBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserInfoModelBuilder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserInfoModelBuilder authorities(Set<String> authorities) {
            this.authorities = authorities;
            return this;
        }

        public UserInfoModelBuilder createdAt(String createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserInfoModelBuilder lastModified(String lastModified) {
            this.lastModified = lastModified;
            return this;
        }

        public UserInfoModelBuilder orgName(String orgName) {
            this.orgName = orgName;
            return this;
        }

        public UserInfoModelBuilder orgId(Long orgId) {
            this.orgId = orgId;
            return this;
        }

        public UserInfoModelBuilder middleName(String middleName) {
            this.middleName = middleName;
            return this;
        }

        public UserInfoModelBuilder job(String job) {
            this.job = job;
            return this;
        }

        public UserInfoModelBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }
        public UserInfoModelBuilder version(Short version) {
            this.version = version;
            return this;
        }

        public UserInfoModel build() {
            return new UserInfoModel(id, name, login, surname, email, enabled, authorities, createdAt, orgName, orgId,
                                     middleName, job, phone, geoserverLogin, lastModified, version);
        }
    }
}
