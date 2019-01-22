package ru.mycrg.gis.service.fgistp.propertyTypes;

import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.service.fgistp.enums.ValueType;
import ru.mycrg.gis.service.validation.ConstraintViolationImpl;

public class StringProperty extends AbstractProperty {

    private Integer minLength = -1;
    private Integer maxLength = -1;
    private String pattern;
    private String patternDescription = "";

    public StringProperty() {
        super(ValueType.STRING);
    }

    public StringProperty(SimplePropertyDto propertyDto) {
        super(propertyDto);

        this.minLength = propertyDto.getMinLength();
        this.maxLength = propertyDto.getMaxLength();
        this.pattern = propertyDto.getPattern();
        this.patternDescription = propertyDto.getPatternDescription();
    }

    @Override
    public ConstraintViolationImpl validate(String value) {
        ConstraintViolationImpl constraintViolation = new ConstraintViolationImpl(getName(), value);

        if (value == null) {
            if (isRequired()) {
                constraintViolation.addViolation("Свойство обязательно к заполнению");
            }

            if (minLength != -1) {
                constraintViolation.addViolation("Минимальная длинна " + minLength);
            }

            if (maxLength != -1) {
                constraintViolation.addViolation("Максимальная длинна " + maxLength);
            }

            if (pattern != null) {
                constraintViolation.addViolation(patternDescription);
            }
        } else {

        }

        return constraintViolation;
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
