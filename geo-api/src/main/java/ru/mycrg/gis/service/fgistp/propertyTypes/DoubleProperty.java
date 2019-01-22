package ru.mycrg.gis.service.fgistp.propertyTypes;

import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.service.fgistp.enums.ValueType;
import ru.mycrg.gis.service.validation.ConstraintViolationImpl;

public class DoubleProperty extends AbstractProperty {

    public DoubleProperty() {
        super(ValueType.DOUBLE);
    }

    public DoubleProperty(SimplePropertyDto propertyDto) {
        super(propertyDto);
    }

    @Override
    public ConstraintViolationImpl validate(String propertyValue) {
        return new ConstraintViolationImpl();
    }
}
