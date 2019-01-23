package ru.mycrg.common.propertyTypes;

import ru.mycrg.common.enums.ValueType;

public class DoubleProperty extends AbstractProperty {

    private Integer totalDigits = -1;

    public DoubleProperty() {
        super(ValueType.DOUBLE);
    }

    public Integer getTotalDigits() {
        return totalDigits;
    }

    public void setTotalDigits(Integer totalDigits) {
        this.totalDigits = totalDigits;
    }
}
