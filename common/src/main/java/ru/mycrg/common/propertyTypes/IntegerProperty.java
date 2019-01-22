package ru.mycrg.common.propertyTypes;

import ru.mycrg.common.enums.ValueType;

public class IntegerProperty extends AbstractProperty {

    public IntegerProperty() {
        super(ValueType.INT);
    }

    private Integer minInclusive = -1;
    private Integer maxInclusive = -1;
    private Integer totalDigits = -1;

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
