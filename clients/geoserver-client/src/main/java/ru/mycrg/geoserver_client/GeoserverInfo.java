package ru.mycrg.geoserver_client;

public class GeoserverInfo {

    private String host;
    private int port;
    private String userServiceName;

    public GeoserverInfo() {
        // Required
    }

    public GeoserverInfo(String host, int port, String userServiceName) {
        this.host = host;
        this.port = port;
        this.userServiceName = userServiceName;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getUserServiceName() {
        return userServiceName;
    }

    public void setUserServiceName(String userServiceName) {
        this.userServiceName = userServiceName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"host\":" + (host == null ? "null" : "\"" + host + "\"") + ", " +
                "\"port\":\"" + port + "\"" + ", " +
                "\"userServiceName\":" + (userServiceName == null ? "null" : "\"" + userServiceName + "\"") +
                "}";
    }
}
