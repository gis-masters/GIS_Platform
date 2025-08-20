package ru.mycrg.geoserver_client.contracts.coveragestores;

public class CoverageStoreRequestModel {
    private final String name;
    private final String workspace;
    private final boolean enabled;
    private final String type;
    private final String url;

    public CoverageStoreRequestModel(String name, String workspace, boolean enabled, String type, String url) {
        this.name = name;
        this.workspace = workspace;
        this.enabled = enabled;
        this.type = type;
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public String getWorkspace() {
        return workspace;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getType() {
        return type;
    }

    public String getUrl() {
        return url;
    }
}
