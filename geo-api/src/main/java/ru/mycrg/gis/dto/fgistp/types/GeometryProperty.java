package ru.mycrg.gis.dto.fgistp.types;

import ru.mycrg.gis.dto.fgistp.ValueType;

import java.util.List;

public class GeometryProperty extends SimplePropertyBase {

    private List<String> allowedValues;

    public GeometryProperty() {
        super(ValueType.GEOMETRY);
    }

    public GeometryProperty(String name) {
        super(name, ValueType.GEOMETRY);
    }

    public List<String> getAllowedValues() {
        return allowedValues;
    }

    public void setAllowedValues(List<String> allowedValues) {
        this.allowedValues = allowedValues;
    }
}
