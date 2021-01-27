package ru.mycrg.auth_service_contract.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class UserInfoModel {

    private Long id;
    private String name;
    private String login;
    private String middleName;
    private String surname;
    private String job;
    private String phone;
    private String email;
    private boolean enabled;
    private Set<String> authorities;
    private LocalDateTime createdAt;

    private String orgName;
    private Long orgId;

    public UserInfoModel() {
        // Test required
    }

    public UserInfoModel(String name) {
        this.name = name;
    }

    public UserInfoModel(Long id, String name, String login, String surname, String email, boolean enabled,
                         Set<String> authorities, LocalDateTime createdAt, String orgName, Long orgId,
                         String middleName, String job, String phone) {
        this.id = id;
        this.name = name;
        this.login = login;
        this.surname = surname;
        this.email = email;
        this.enabled = enabled;
        this.authorities = authorities;
        this.createdAt = createdAt;
        this.orgName = orgName;
        this.orgId = orgId;
        this.middleName = middleName;
        this.job = job;
        this.phone = phone;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getOrgName() {
        return orgName;
    }

    public Long getOrgId() {
        return orgId;
    }

    public static class UserInfoModelBuilder {
        private Long id;
        private String name;
        private String login;
        private String surname;
        private String email;
        private boolean enabled;
        private Set<String> authorities;
        private LocalDateTime createdAt;
        private String orgName;
        private Long orgId;
        private String middleName;
        private String job;
        private String phone;

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

        public UserInfoModelBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
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

        public UserInfoModel build() {
            return new UserInfoModel(id, name, login, surname, email, enabled, authorities, createdAt, orgName, orgId,
                                     middleName, job, phone);
        }

        public String toString() {
            return "UserInfoModel.UserInfoModelBuilder(id=" + this.id + ", name=" + this.name + ", login=" + this.login + ", surname=" + this.surname + ", email=" + this.email + ", enabled=" + this.enabled + ", authorities=" + this.authorities + ", createdAt=" + this.createdAt + ", orgName=" + this.orgName + ", orgId=" + this.orgId + ", middleName=" + this.middleName + ", job=" + this.job + ", phone=" + this.phone + ")";
        }
    }
}
