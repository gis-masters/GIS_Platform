package ru.mycrg.geoserver_client.services.layers.rasters;

public class CoverageModel {

    private final String name;
    private final String title;
    private final String nativeCRS;
    private final String srs;
    private final String projectionPolicy;

    public CoverageModel(String name, String title, String nativeCRS, String srs) {
        this.name = name;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.srs = srs;
        this.projectionPolicy = "FORCE_DECLARED";
    }

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public String getSrs() {
        return srs;
    }

    public String getProjectionPolicy() {
        return projectionPolicy;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"srs\":" + (srs == null ? "null" : "\"" + srs + "\"") + ", " +
                "\"projectionPolicy\":" + "\"" + projectionPolicy + "\"" +
                "}";
    }
}
