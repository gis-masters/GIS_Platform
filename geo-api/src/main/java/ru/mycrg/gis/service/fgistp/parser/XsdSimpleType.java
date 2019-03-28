package ru.mycrg.gis.service.fgistp.parser;

import java.util.HashMap;
import java.util.Map;

public class XsdSimpleType {

    private String name;
    private Map<String, String> properties = new HashMap<>();

    public XsdSimpleType() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, String> properties) {
        this.properties = properties;
    }
}
