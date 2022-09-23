package ru.mycrg.geoserver_client.services.layers.models;

import ru.mycrg.geoserver_client.contracts.NameHrefProjection;

public class Layer {

    private String name;
    private String type;
    private Style defaultStyle;
    private NameHrefProjection resource;

    public Layer() {
        // Required
    }

    public Layer(String name, String type, Style defaultStyle,
                 NameHrefProjection resource) {
        this.name = name;
        this.type = type;
        this.defaultStyle = defaultStyle;
        this.resource = resource;
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

    public NameHrefProjection getResource() {
        return resource;
    }

    public void setResource(NameHrefProjection resource) {
        this.resource = resource;
    }
}
