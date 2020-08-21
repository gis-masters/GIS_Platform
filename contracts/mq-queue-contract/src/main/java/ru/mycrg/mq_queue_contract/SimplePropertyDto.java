package ru.mycrg.mq_queue_contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import ru.mycrg.mq_queue_contract.enums.ChoiceType;
import ru.mycrg.mq_queue_contract.enums.ForeignKeyType;
import ru.mycrg.mq_queue_contract.enums.Updateability;
import ru.mycrg.mq_queue_contract.enums.ValueType;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SimplePropertyDto {

    private String name;
    private String title;
    private String description;

    private boolean required;
    private boolean hidden;

    private boolean objectIdentityOnUi;

    private Updateability updateability;
    private boolean multiple;
    private ChoiceType choice;
    private ValueType valueType;
    private ForeignKeyType foreignKeyType;

    private String resourcePath;
    private String whiteSpace;
    private String pattern;
    private String patternDescription = "";

    private String dateFormat;
    private String displayMode;

    private int sequenceNumber;

    private Integer length = -1;
    private Integer minLength = -1;
    private Integer maxLength = -1;
    private Integer minInclusive = -1;
    private Integer maxInclusive = -1;
    private Integer totalDigits = -1;
    private Integer fractionDigits = -1;
    private List<ValueTitleProjection> enumerations = new ArrayList<>();
    private List<String> allowedValues = new ArrayList<>();

    public SimplePropertyDto() {}

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
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
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

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public String getWhiteSpace() {
        return whiteSpace;
    }

    public void setWhiteSpace(String whiteSpace) {
        this.whiteSpace = whiteSpace;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getFractionDigits() {
        return fractionDigits;
    }

    public void setFractionDigits(Integer fractionDigits) {
        this.fractionDigits = fractionDigits;
    }

    public boolean isObjectIdentityOnUi() {
        return objectIdentityOnUi;
    }

    public void setObjectIdentityOnUi(boolean objectIdentityOnUi) {
        this.objectIdentityOnUi = objectIdentityOnUi;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public String getDisplayMode() {
        return displayMode;
    }

    public void setDisplayMode(String displayMode) {
        this.displayMode = displayMode;
    }

    public ForeignKeyType getForeignKeyType() {
        return foreignKeyType;
    }

    public void setForeignKeyType(ForeignKeyType foreignKeyType) {
        this.foreignKeyType = foreignKeyType;
    }

    public String getResourcePath() {
        return resourcePath;
    }

    public void setResourcePath(String resourcePath) {
        this.resourcePath = resourcePath;
    }

    @JsonIgnore
    public boolean isGeometry() {
        return this.valueType == ValueType.GEOMETRY;
    }
}
