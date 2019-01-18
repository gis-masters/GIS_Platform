package ru.mycrg.gis.dto.fgistp.types;

import ru.mycrg.gis.dto.fgistp.ValueType;

import java.util.ArrayList;
import java.util.List;

public class GeometryProperty extends SimplePropertyBase {

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
