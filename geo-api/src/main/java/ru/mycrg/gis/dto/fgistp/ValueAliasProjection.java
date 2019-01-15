package ru.mycrg.gis.dto.fgistp;

public class ValueAliasProjection {

    private String value;
    private String alias;

    public ValueAliasProjection() {}

    public ValueAliasProjection(String value, String alias) {
        this.value = value;
        this.alias = alias;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
