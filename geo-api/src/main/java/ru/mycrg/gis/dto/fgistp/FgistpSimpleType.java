package ru.mycrg.gis.dto.fgistp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FgistpSimpleType {

    private String name;
    private Map<String, String> properties = new HashMap<>();

    public FgistpSimpleType() {}

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
