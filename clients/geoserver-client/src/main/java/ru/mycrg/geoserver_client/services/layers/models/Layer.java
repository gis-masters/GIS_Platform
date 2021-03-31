package ru.mycrg.geoserver_client.services.layers.models;

public class Layer {

    private String name;
    private String type;
    private Style defaultStyle;

    public Layer(String name, String type, Style defaultStyle) {
        this.name = name;
        this.type = type;
        this.defaultStyle = defaultStyle;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Style getDefaultStyle() {
        return defaultStyle;
    }

    public void setDefaultStyle(Style defaultStyle) {
        this.defaultStyle = defaultStyle;
    }
}
