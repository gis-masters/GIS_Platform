package ru.mycrg.gis.service.fgistp;

public class ValueTitleProjection {

    private String value;
    private String title;

    public ValueTitleProjection() {}

    public ValueTitleProjection(String value, String title) {
        this.value = value;
        this.title = title;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
