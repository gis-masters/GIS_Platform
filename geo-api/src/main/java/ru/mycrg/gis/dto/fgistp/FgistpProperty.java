package ru.mycrg.gis.dto.fgistp;

import ru.mycrg.gis.dto.fgistp.types.FgistpBaseType;

public class FgistpProperty extends NameAliasProjection {

    private FgistpBaseType baseType;
    private int minOccurs;
    private int maxOccurs;

    public FgistpProperty() {}

    public FgistpProperty(String name) {
        super(name);
    }

    public FgistpBaseType getBaseType() {
        return baseType;
    }

    public void setBaseType(FgistpBaseType baseType) {
        this.baseType = baseType;
    }

    public int getMinOccurs() {
        return minOccurs;
    }

    public void setMinOccurs(int minOccurs) {
        this.minOccurs = minOccurs;
    }

    public int getMaxOccurs() {
        return maxOccurs;
    }

    public void setMaxOccurs(int maxOccurs) {
        this.maxOccurs = maxOccurs;
    }
}
