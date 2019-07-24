package ru.mycrg.wrapper.geoserver_client;

public enum GeoServerPermissions {
    ADMIN("a"),
    READ("r"),
    WRITE("w");

    private String permission;

    GeoServerPermissions(String reportType) {
        this.permission = reportType;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}
