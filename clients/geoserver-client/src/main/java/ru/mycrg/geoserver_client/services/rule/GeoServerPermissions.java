package ru.mycrg.geoserver_client.services.rule;

public enum GeoServerPermissions {
    ADMIN("a"),
    READ("r"),
    WRITE("w");

    private final String permission;

    GeoServerPermissions(String reportType) {
        this.permission = reportType;
    }

    public String getPermission() {
        return permission;
    }
}
