package ru.mycrg.auth_service_contract;

import java.util.List;

public class OrganizationRemovedEvent extends OrganizationBaseEvent {

    private List<String> workspaces;
    private List<String> users;
    private List<String> roles;

    public OrganizationRemovedEvent() {
    }

    public OrganizationRemovedEvent(List<String> workspaces, List<String> users, List<String> roles) {
        this.workspaces = workspaces;
        this.users = users;
        this.roles = roles;
    }

    public List<String> getWorkspaces() {
        return workspaces;
    }

    public void setWorkspaces(List<String> workspaces) {
        this.workspaces = workspaces;
    }

    public List<String> getUsers() {
        return users;
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
