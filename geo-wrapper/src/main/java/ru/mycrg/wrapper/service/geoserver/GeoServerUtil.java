package ru.mycrg.wrapper.service.geoserver;

public class GeoServerUtil {

    public static String buildRule(String workspace, String layer, GeoServerPermissions permission) {
        return String.join(".", workspace, layer, permission.getPermission());
    }

    public static String buildRule(String workspace, GeoServerPermissions permission) {
        return buildRule(workspace, "*", permission);
    }
}
