package ru.mycrg.geoserver_client.services.user_role;

import java.util.List;

public class GeoserverRoleResponse {

    List<String> roles;

    public GeoserverRoleResponse(List<String> roles) {
        this.roles = roles;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
