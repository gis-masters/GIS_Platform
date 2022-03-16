package ru.mycrg.geo_json;

import ru.mycrg.geo_json.jackson.CrsType;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class Crs implements Serializable {

    private CrsType type = CrsType.NAME;
    private Map<String, Object> properties = new HashMap<>();

    public CrsType getType() {
        return type;
    }

    public void setType(CrsType type) {
        this.type = type;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof Crs)) {
            return false;
        }

        Crs crs = (Crs) o;
        if (properties != null ? !properties.equals(crs.properties) : crs.properties != null) {
            return false;
        }

        return !(type != null ? !type.equals(crs.type) : crs.type != null);
    }

    @Override
    public int hashCode() {
        int result = type != null ? type.hashCode() : 0;
        result = 31 * result + (properties != null ? properties.hashCode() : 0);

        return result;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "\"properties\":" + (properties == null ? "null" : "\"" + properties + "\"") +
                "}";
    }
}
