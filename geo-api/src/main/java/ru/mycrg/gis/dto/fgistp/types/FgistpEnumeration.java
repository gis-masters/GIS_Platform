package ru.mycrg.gis.dto.fgistp.types;

import ru.mycrg.gis.dto.fgistp.ValueAliasProjection;

import java.util.ArrayList;
import java.util.List;

public class FgistpEnumeration extends FgistpBaseType {

    private List<ValueAliasProjection> enumerations = new ArrayList<>();

    public FgistpEnumeration() {}

    public List<ValueAliasProjection> getEnumerations() {
        return enumerations;
    }

    public void setEnumerations(List<ValueAliasProjection> enumerations) {
        this.enumerations = enumerations;
    }

    public void addValue(int value) {
        enumerations.add(new ValueAliasProjection(String.valueOf(value), ""));
    }
}
