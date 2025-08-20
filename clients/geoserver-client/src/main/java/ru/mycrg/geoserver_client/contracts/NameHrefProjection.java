package ru.mycrg.geoserver_client.contracts;

public class NameHrefProjection {

    private String name;
    private String href;

    public NameHrefProjection() {
        // Required
    }

    public NameHrefProjection(String name, String href) {
        this.name = name;
        this.href = href;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }
}
