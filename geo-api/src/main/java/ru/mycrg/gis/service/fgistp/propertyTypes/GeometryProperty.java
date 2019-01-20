package ru.mycrg.gis.service.fgistp.propertyTypes;

import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.service.fgistp.enums.ValueType;

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

    public GeometryProperty(SimplePropertyDto propertyDto) {
        super(propertyDto);

        this.allowedValues = propertyDto.getAllowedValues();
    }

    public List<String> getAllowedValues() {
        return allowedValues;
    }

    public void setAllowedValues(List<String> allowedValues) {
        this.allowedValues = allowedValues;
    }
}
