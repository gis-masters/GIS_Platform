package ru.mycrg.gis.dto.fgistp;

public class NameAliasProjection {

    private String name;
    private String alias;

    public NameAliasProjection() {}

    public NameAliasProjection(String name) {
        this.name = name;
    }

    public NameAliasProjection(String name, String alias) {
        this.name = name;
        this.alias = alias;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
