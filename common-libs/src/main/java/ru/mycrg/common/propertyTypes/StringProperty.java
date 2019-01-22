package ru.mycrg.common.propertyTypes;

import ru.mycrg.common.enums.ValueType;

public class StringProperty extends AbstractProperty {

    private Integer minLength = -1;
    private Integer maxLength = -1;
    private String pattern;
    private String patternDescription = "";

    public StringProperty() {
        super(ValueType.STRING);
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
