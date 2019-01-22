package ru.mycrg.gis.dto;

import ru.mycrg.common.propertyTypes.ValueTitleProjection;
import ru.mycrg.common.enums.ChoiceType;
import ru.mycrg.common.enums.Updateability;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.propertyTypes.*;

import java.util.ArrayList;
import java.util.List;

public class SimplePropertyDto {

    private String name;
    private String title;
    private String description;

    private boolean required;
    private boolean hidden;

    private Updateability updateability;
    private boolean isMultiple;
    private ChoiceType choice;
    private ValueType valueType;

    private List<ValueTitleProjection> enumerations = new ArrayList<>();
    private List<String> allowedValues = new ArrayList<>();
    private Integer minInclusive = -1;
    private Integer maxInclusive = -1;
    private Integer totalDigits = -1;
    private Integer minLength = -1;
    private Integer maxLength = -1;
    private String pattern;
    private String patternDescription = "";

    public SimplePropertyDto() {}

    public SimplePropertyDto(AbstractProperty abstractProperty) {
        this.name = abstractProperty.getName();
        this.title = abstractProperty.getTitle();
        this.description = abstractProperty.getDescription();
        this.required = abstractProperty.isRequired();
        this.hidden = abstractProperty.isHidden();
        this.updateability = abstractProperty.getUpdateability();
        this.isMultiple = abstractProperty.isMultiple();
        this.choice = abstractProperty.getChoice();
        this.valueType = abstractProperty.getValueType();

        if (abstractProperty instanceof StringProperty) {
            StringProperty stringProperty = (StringProperty) abstractProperty;
            this.minLength = stringProperty.getMinLength();
            this.maxLength = stringProperty.getMaxLength();
            this.pattern = stringProperty.getPattern();
            this.patternDescription = stringProperty.getPatternDescription();
        } else if (abstractProperty instanceof IntegerProperty) {
            IntegerProperty integerProperty = (IntegerProperty) abstractProperty;
            this.minInclusive = integerProperty.getMinInclusive();
            this.maxInclusive = integerProperty.getMaxInclusive();
            this.totalDigits = integerProperty.getTotalDigits();
        } else if (abstractProperty instanceof GeometryProperty) {
            GeometryProperty geometryProperty = (GeometryProperty) abstractProperty;
            this.allowedValues = geometryProperty.getAllowedValues();
        } else if (abstractProperty instanceof EnumerationProperty) {
            EnumerationProperty enumerationProperty = (EnumerationProperty) abstractProperty;
            this.enumerations = enumerationProperty.getEnumerations();
        } else if (abstractProperty instanceof DoubleProperty) {

        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public Updateability getUpdateability() {
        return updateability;
    }

    public void setUpdateability(Updateability updateability) {
        this.updateability = updateability;
    }

    public boolean isMultiple() {
        return isMultiple;
    }

    public void setMultiple(boolean multiple) {
        isMultiple = multiple;
    }

    public ChoiceType getChoice() {
        return choice;
    }

    public void setChoice(ChoiceType choice) {
        this.choice = choice;
    }

    public ValueType getValueType() {
        return valueType;
    }

    public void setValueType(ValueType valueType) {
        this.valueType = valueType;
    }

    public List<ValueTitleProjection> getEnumerations() {
        return enumerations;
    }

    public void setEnumerations(List<ValueTitleProjection> enumerations) {
        this.enumerations = enumerations;
    }

    public List<String> getAllowedValues() {
        return allowedValues;
    }

    public void setAllowedValues(List<String> allowedValues) {
        this.allowedValues = allowedValues;
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
