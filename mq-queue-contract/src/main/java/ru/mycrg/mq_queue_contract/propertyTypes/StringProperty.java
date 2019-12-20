package ru.mycrg.mq_queue_contract.propertyTypes;

import ru.mycrg.mq_queue_contract.enums.ValueType;

public class StringProperty extends AbstractProperty {

    /**
     * Определяет точное число символов или объектов списка. Должно быть равно или больше нуля.
     */
    private Integer length = -1;

    /**
     * Определяет минимальное число символов или объектов списка. Должно быть равно или больше нуля
     */
    private Integer minLength = -1;

    /**
     * Определяет максимальное число символов или объектов списка. Должно быть равно или больше нуля
     */
    private Integer maxLength = -1;

    public StringProperty() {
        super(ValueType.STRING);
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getMinLength() {
        return minLength;
    }

    public void setMinLength(Integer minLength) {
        this.minLength = minLength;
    }

    public Integer getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(Integer maxLength) {
        this.maxLength = maxLength;
    }

}
