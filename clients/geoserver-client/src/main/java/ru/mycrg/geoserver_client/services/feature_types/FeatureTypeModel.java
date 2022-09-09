package ru.mycrg.geoserver_client.services.feature_types;

public class FeatureTypeModel {

    private final String name;
    private final String nativeName;
    private final String srs;
    private final boolean enabled;

    public FeatureTypeModel(String name, String nativeName, String srs, boolean enabled) {
        this.name = name;
        this.nativeName = nativeName;
        this.srs = srs;
        this.enabled = enabled;
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
}
