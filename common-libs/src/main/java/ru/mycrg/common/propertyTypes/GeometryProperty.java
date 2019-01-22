package ru.mycrg.common.propertyTypes;

import ru.mycrg.common.enums.ValueType;

import java.util.ArrayList;
import java.util.List;

public class GeometryProperty extends AbstractProperty {

    private List<String> allowedValues = new ArrayList<>();

    public GeometryProperty() {
        super("Geometry", ValueType.GEOMETRY);
    }

    public GeometryProperty(String name) {
        super("Geometry", ValueType.GEOMETRY);

        this.allowedValues.add(name);
    }

    public List<String> getAllowedValues() {
        return allowedValues;
    }

    public void setAllowedValues(List<String> allowedValues) {
        this.allowedValues = allowedValues;
    }
}
