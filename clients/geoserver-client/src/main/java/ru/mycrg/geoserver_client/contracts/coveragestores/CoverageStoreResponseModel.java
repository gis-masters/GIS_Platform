package ru.mycrg.geoserver_client.contracts.coveragestores;

import ru.mycrg.geoserver_client.contracts.NameHrefProjection;

public class CoverageStoreResponseModel {

    private String name;
    private String type;
    private boolean enabled;
    private NameHrefProjection workspace;
    private String url;
    private boolean _default;
    private String coverages;

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

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public NameHrefProjection getWorkspace() {
        return workspace;
    }

    public void setWorkspace(NameHrefProjection workspace) {
        this.workspace = workspace;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean is_default() {
        return _default;
    }

    public void set_default(boolean _default) {
        this._default = _default;
    }

    public String getCoverages() {
        return coverages;
    }

    public void setCoverages(String coverages) {
        this.coverages = coverages;
    }
}
