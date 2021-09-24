package ru.mycrg.geoserver_client.services.layers.rasters;

public class CoverageModel {

    private final String name;
    private final String title;
    private final String nativeCRS;
    private final String srs;

    public CoverageModel(String name, String title, String nativeCRS, String srs) {
        this.name = name;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.srs = srs;
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
}
