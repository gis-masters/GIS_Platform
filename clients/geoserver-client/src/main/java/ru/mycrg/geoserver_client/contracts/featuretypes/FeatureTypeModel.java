package ru.mycrg.geoserver_client.contracts.featuretypes;

public class FeatureTypeModel {

    private final String title;         // This is usually something that is meant to be displayed in a user interface.
    private final String name;          // This name corresponds to the "published" name of the resource.
    private final String nativeName;    // This name corresponds to the physical resource that feature type is derived from -- a shapefile name, a database table, etc...
    private final boolean enabled;      // Вкл/выкл? Но не нашел описания в документации геосервера
    private final String nativeCRS;     // The native coordinate reference system
    private final String srs;           // Declared SRS

    public FeatureTypeModel(String name, String nativeName, String nativeCRS) {
        this(name, name, nativeName, true, nativeCRS, nativeCRS);
    }

    public FeatureTypeModel(String title, String name, String nativeName, boolean enabled, String nativeCRS,
                            String declaredCRS) {
        this.title = title;
        this.name = name;
        this.nativeName = nativeName;
        this.enabled = enabled;
        this.nativeCRS = nativeCRS;
        this.srs = declaredCRS;
    }

    public String getTitle() {
        return title;
    }

    public String getName() {
        return name;
    }

    public String getNativeName() {
        return nativeName;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getSrs() {
        return srs;
    }

    @Override
    public String toString() {
        return "{" +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"nativeName\":" + (nativeName == null ? "null" : "\"" + nativeName + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"srs\":" + (srs == null ? "null" : "\"" + srs + "\"") +
                "}";
    }
}
