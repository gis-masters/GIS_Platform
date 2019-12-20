package ru.mycrg.mq_queue_contract.propertyTypes;

import ru.mycrg.mq_queue_contract.enums.ValueType;

public class DoubleProperty extends AbstractProperty {

    /**
     * Определяет точное количество допустимых цифр. Должно быть больше нуля
     */
    private Integer totalDigits = -1;

    /**
     * Определяет максимальное число знаков после десятичной запятой. Должно быть равно или больше нуля
     */
    private Integer fractionDigits = -1;

    public DoubleProperty() {
        super(ValueType.DOUBLE);
    }

    public Integer getFractionDigits() {
        return fractionDigits;
    }

    public void setFractionDigits(Integer fractionDigits) {
        this.fractionDigits = fractionDigits;
    }

    public Integer getTotalDigits() {
        return totalDigits;
    }

    public void setTotalDigits(Integer totalDigits) {
        this.totalDigits = totalDigits;
    }
}
