package ru.mycrg.gis.dto.fgistp.types;

import ru.mycrg.gis.dto.fgistp.ValueTitleProjection;
import ru.mycrg.gis.dto.fgistp.ValueType;

import java.util.ArrayList;
import java.util.List;

public class EnumerationProperty extends SimplePropertyBase {

    private List<ValueTitleProjection> enumerations = new ArrayList<>();

    public EnumerationProperty() {
        super(ValueType.CHOICE);
    }

    public EnumerationProperty(String name) {
        super(name);
    }

    public List<ValueTitleProjection> getEnumerations() {
        return enumerations;
    }

    public void setEnumerations(List<ValueTitleProjection> enumerations) {
        this.enumerations = enumerations;
    }

    public void addValue(int value) {
        enumerations.add(new ValueTitleProjection(String.valueOf(value), ""));
    }
}
