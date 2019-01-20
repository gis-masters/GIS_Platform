package ru.mycrg.gis.service.fgistp.propertyTypes;

import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.service.fgistp.ValueTitleProjection;
import ru.mycrg.gis.service.fgistp.enums.ValueType;

import java.util.ArrayList;
import java.util.List;

public class EnumerationProperty extends AbstractProperty {

    private List<ValueTitleProjection> enumerations = new ArrayList<>();

    public EnumerationProperty() {
        super(ValueType.CHOICE);
    }

    public EnumerationProperty(String name) {
        super(name);
    }

    public EnumerationProperty(SimplePropertyDto propertyDto) {
        super(propertyDto);

        this.enumerations = propertyDto.getEnumerations();
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
