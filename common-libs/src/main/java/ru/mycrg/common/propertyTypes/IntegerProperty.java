package ru.mycrg.common.propertyTypes;

import ru.mycrg.common.enums.ValueType;

public class IntegerProperty extends AbstractProperty {

    /**
     * Определяет нижнюю границу для числовых значений (значение должно быть больше или равно указанному здесь)
     */
    private Integer minInclusive = -1;

    /**
     * Определяет верхнюю границу для числовых значений (значение должно быть меньше или равно указанному здесь)
     */
    private Integer maxInclusive = -1;

    /**
     * Определяет максимальное число знаков после десятичной запятой. Должно быть равно или больше нуля
     */
    private Integer fractionDigits = -1;

    /**
     * Определяет точное количество допустимых цифр. Должно быть больше нуля
     */
    private Integer totalDigits = -1;

    public IntegerProperty() {
        super(ValueType.INT);
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
