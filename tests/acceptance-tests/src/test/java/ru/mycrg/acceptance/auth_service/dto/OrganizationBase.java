package ru.mycrg.acceptance.auth_service.dto;

import java.util.List;

public class OrganizationBase {

    private Integer id;
    private String name;
    private List<UserDto> users;
    private String createdAt;
    private String phone;
    private String description;
    private List<UserGroupDto> groups;
    private Object settings;
    private String status;

    public OrganizationBase() {
        // Required
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UserDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserDto> users) {
        this.users = users;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getPhone() {
        return phone;
    }

    public String getDescription() {
        return description;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<UserGroupDto> getGroups() {
        return groups;
    }

    public void setGroups(List<UserGroupDto> groups) {
        this.groups = groups;
    }

    public Object getSettings() {
        return settings;
    }

    public void setSettings(Object settings) {
        this.settings = settings;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
