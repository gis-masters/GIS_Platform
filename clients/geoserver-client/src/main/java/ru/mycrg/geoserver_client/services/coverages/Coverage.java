package ru.mycrg.geoserver_client.services.coverages;

public class Coverage {

    private final String name;
    private final String title;
    private final String nativeCRS;
    private final String srs;

    public Coverage(String name, String title, String nativeCRS) {
        this.name = name;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.srs = "EPSG:" + nativeCRS;
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
