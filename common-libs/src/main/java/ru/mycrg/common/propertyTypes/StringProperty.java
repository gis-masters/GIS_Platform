package ru.mycrg.common.propertyTypes;

import ru.mycrg.common.enums.ValueType;

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

    /**
     * Определяет точную последовательность приемлемых символов
     */
    private String pattern;

    /**
     * Описание паттерна
     */
    private String patternDescription = "";

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

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getPatternDescription() {
        return patternDescription;
    }

    public void setPatternDescription(String patternDescription) {
        this.patternDescription = patternDescription;
    }
}
