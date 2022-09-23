package ru.mycrg.geoserver_client.contracts.featuretypes;

public class FeatureTypeModel {

    private final String name;
    private final String nativeName;
    private final String srs;
    private final boolean enabled;

    public FeatureTypeModel(String name, String srs, boolean enabled) {
        this.name = name;
        this.srs = srs;
        this.enabled = enabled;

        this.nativeName = "entities";
    }

    public String getName() {
        return name;
    }

    public String getNativeName() {
        return nativeName;
    }

    public String getSrs() {
        return srs;
    }

    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"nativeName\":" + (nativeName == null ? "null" : "\"" + nativeName + "\"") + ", " +
                "\"srs\":" + (srs == null ? "null" : "\"" + srs + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" +
                "}";
    }
}
