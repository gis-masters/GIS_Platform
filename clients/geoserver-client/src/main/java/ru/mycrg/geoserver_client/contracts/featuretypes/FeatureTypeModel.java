package ru.mycrg.geoserver_client.contracts.featuretypes;

public class FeatureTypeModel {

    private final String name;
    private final String nativeName;
    private final boolean enabled;
    private final String srs;

    public FeatureTypeModel(String name, String nativeName, String srs) {
        this(name, nativeName, true, srs);
    }

    public FeatureTypeModel(String name, String nativeName, boolean enabled, String srs) {
        this.name = name;
        this.nativeName = nativeName;
        this.enabled = enabled;
        this.srs = srs;
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
