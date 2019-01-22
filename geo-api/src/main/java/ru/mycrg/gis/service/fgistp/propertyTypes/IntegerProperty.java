package ru.mycrg.gis.service.fgistp.propertyTypes;

import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.service.fgistp.enums.ValueType;
import ru.mycrg.gis.service.validation.ConstraintViolationImpl;

public class IntegerProperty extends AbstractProperty {

    public IntegerProperty() {
        super(ValueType.INT);
    }

    private Integer minInclusive = -1;
    private Integer maxInclusive = -1;
    private Integer totalDigits = -1;

    public IntegerProperty(SimplePropertyDto propertyDto) {
        super(propertyDto);

        this.maxInclusive = propertyDto.getMaxInclusive();
        this.minInclusive = propertyDto.getMinInclusive();
        this.totalDigits = propertyDto.getTotalDigits();
    }

    @Override
    public ConstraintViolationImpl validate(String propertyValue) {
        return new ConstraintViolationImpl();
    }

    public Integer getMinInclusive() {
        return minInclusive;
    }

    public void setMinInclusive(Integer minInclusive) {
        this.minInclusive = minInclusive;
    }

    public Integer getMaxInclusive() {
        return maxInclusive;
    }

    public void setMaxInclusive(Integer maxInclusive) {
        this.maxInclusive = maxInclusive;
    }

    public Integer getTotalDigits() {
        return totalDigits;
    }

    public void setTotalDigits(Integer totalDigits) {
        this.totalDigits = totalDigits;
    }
}
