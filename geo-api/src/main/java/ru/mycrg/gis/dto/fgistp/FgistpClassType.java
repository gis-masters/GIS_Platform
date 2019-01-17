package ru.mycrg.gis.dto.fgistp;

import java.util.ArrayList;
import java.util.List;

public class FgistpClassType extends NameAliasProjection {

    private NameAliasProjection group = new NameAliasProjection();
    private List<FgistpProperty> properties = new ArrayList<>();
    private List<String> geometryTypes = new ArrayList<>();

    public FgistpClassType() {}

    public FgistpClassType(String name) {
        super(name);
    }

    public List<FgistpProperty> getProperties() {
        return properties;
    }

    public void setProperties(List<FgistpProperty> properties) {
        this.properties = properties;
    }

    public List<String> getGeometryTypes() {
        return geometryTypes;
    }

    public void setGeometryTypes(List<String> geometryTypes) {
        this.geometryTypes = geometryTypes;
    }

    public void addGeometry(String type) {
        geometryTypes.add(type);
    }

    public NameAliasProjection getGroup() {
        return group;
    }

    public void setGroup(NameAliasProjection group) {
        this.group = group;
    }
}
