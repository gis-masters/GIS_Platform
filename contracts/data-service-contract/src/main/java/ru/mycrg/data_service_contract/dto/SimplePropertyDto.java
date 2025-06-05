package ru.mycrg.data_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import ru.mycrg.data_service_contract.enums.ChoiceType;
import ru.mycrg.data_service_contract.enums.ForeignKeyType;
import ru.mycrg.data_service_contract.enums.Updateability;
import ru.mycrg.data_service_contract.enums.ValueType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SimplePropertyDto {

    @NotBlank
    private String name;

    @NotBlank
    private String title;

    @NotBlank
    @Pattern(regexp = "^(BOOLEAN|INT|LONG|STRING|TEXT|DOUBLE|CHOICE|GEOMETRY|URL|DATETIME|LOOKUP|UUID|FIAS" +
            "|DOCUMENT|FILE|USER_ID|USER|VERSIONS)$",
             message = "Допустимые значения поля type: BOOLEAN|INT|LONG|STRING|TEXT|DOUBLE|CHOICE|GEOMETRY|URL" +
                     "|DATETIME|LOOKUP|UUID|FIAS|DOCUMENT|FILE|USER_ID|USER|VERSIONS")
    private String valueType;

    private Boolean required;
    private Boolean hidden;
    private Boolean objectIdentityOnUi;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean asTitle;
    private Boolean onlySubordinates;

    private String description;
    private Updateability updateability;
    private ChoiceType choice;
    private ForeignKeyType foreignKeyType;

    private String resourcePath;
    private String folderId;
    private String whiteSpace;
    private String pattern;
    private String patternDescription;
    private String accept;
    private String library; // Удалите меня когда-нить - я не нужная пропертя, оставленная ленивыми программистами.
    private List<String> libraries;

    private String dateFormat;
    private String displayMode;
    private String display;

    private String searchMode;
    private Object defaultValue;

    private Integer sequenceNumber;

    private String calculatedValueFormula;
    private String validationFormula;
    private String calculatedValueWellKnownFormula;
    private String defaultValueFormula;
    private String defaultValueWellKnownFormula;
    private String dynamicPropertyFormula;
    private Object valueFormulaParams;

    private List<FollowUpAction> followUpActions;
    private List<Object> options;

    private Integer length;
    private Integer minLength;
    private Integer maxLength;
    private Integer minInclusive;
    private Integer maxInclusive;
    private Integer totalDigits;
    private Integer fractionDigits;
    private Integer minWidth;
    private Integer maxSize;
    private Integer maxFiles;
    private Integer maxDocuments;
    private Integer maxDefaultWidth;
    private List<ValueTitleProjection> enumerations;
    private List<String> allowedValues;

    public SimplePropertyDto() {
        // Required
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

    public Boolean isRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Boolean isHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public Boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(Boolean readOnly) {
        this.readOnly = readOnly;
    }

    public Updateability getUpdateability() {
        return updateability;
    }

    public void setUpdateability(Updateability updateability) {
        this.updateability = updateability;
    }

    public Boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(Boolean multiple) {
        this.multiple = multiple;
    }

    public ChoiceType getChoice() {
        return choice;
    }

    public void setChoice(ChoiceType choice) {
        this.choice = choice;
    }

    @JsonIgnore
    public ValueType getValueTypeAsEnum() {
        if (valueType != null) {
            return ValueType.valueOf(valueType);
        }

        return null;
    }

    public void setValueType(ValueType valueType) {
        this.valueType = valueType.name();
    }

    public String getValueType() {
        return valueType;
    }

    public void setValueType(String valueType) {
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

    public Integer getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(Integer sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public String getCalculatedValueFormula() {
        return calculatedValueFormula;
    }

    public void setCalculatedValueFormula(String calculatedValueFormula) {
        this.calculatedValueFormula = calculatedValueFormula;
    }

    public String getCalculatedValueWellKnownFormula() {
        return calculatedValueWellKnownFormula;
    }

    public void setCalculatedValueWellKnownFormula(String calculatedValueWellKnownFormula) {
        this.calculatedValueWellKnownFormula = calculatedValueWellKnownFormula;
    }

    public Object getValueFormulaParams() {
        return valueFormulaParams;
    }

    public void setValueFormulaParams(Object valueFormulaParams) {
        this.valueFormulaParams = valueFormulaParams;
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

    public Boolean isObjectIdentityOnUi() {
        return objectIdentityOnUi;
    }

    public void setObjectIdentityOnUi(Boolean objectIdentityOnUi) {
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

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    public String getSearchMode() {
        return searchMode;
    }

    public void setSearchMode(String searchMode) {
        this.searchMode = searchMode;
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

    public Integer getMinWidth() {
        return minWidth;
    }

    public void setMinWidth(Integer minWidth) {
        this.minWidth = minWidth;
    }

    public String getFolderId() {
        return folderId;
    }

    public void setFolderId(String folderId) {
        this.folderId = folderId;
    }

    public String getAccept() {
        return accept;
    }

    public void setAccept(String accept) {
        this.accept = accept;
    }

    public List<String> getLibraries() {
        return libraries;
    }

    public void setLibraries(List<String> libraries) {
        this.libraries = libraries;
    }

    public Integer getMaxSize() {
        return maxSize;
    }

    public void setMaxSize(Integer maxSize) {
        this.maxSize = maxSize;
    }

    public Integer getMaxFiles() {
        return maxFiles;
    }

    public void setMaxFiles(Integer maxFiles) {
        this.maxFiles = maxFiles;
    }

    public Integer getMaxDocuments() {
        return maxDocuments;
    }

    public void setMaxDocuments(Integer maxDocuments) {
        this.maxDocuments = maxDocuments;
    }

    @JsonIgnore
    public boolean isGeometry() {
        return this.getValueTypeAsEnum() == ValueType.GEOMETRY;
    }

    public String getLibrary() {
        return library;
    }

    public void setLibrary(String library) {
        this.library = library;
    }

    public Object getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(Object defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getValidationFormula() {
        return validationFormula;
    }

    public void setValidationFormula(String validationFormula) {
        this.validationFormula = validationFormula;
    }

    public String getDefaultValueFormula() {
        return defaultValueFormula;
    }

    public void setDefaultValueFormula(String defaultValueFormula) {
        this.defaultValueFormula = defaultValueFormula;
    }

    public String getDefaultValueWellKnownFormula() {
        return defaultValueWellKnownFormula;
    }

    public void setDefaultValueWellKnownFormula(String defaultValueWellKnownFormula) {
        this.defaultValueWellKnownFormula = defaultValueWellKnownFormula;
    }

    public String getDynamicPropertyFormula() {
        return dynamicPropertyFormula;
    }

    public void setDynamicPropertyFormula(String dynamicPropertyFormula) {
        this.dynamicPropertyFormula = dynamicPropertyFormula;
    }

    public Boolean getAsTitle() {
        return asTitle;
    }

    public void setAsTitle(Boolean asTitle) {
        this.asTitle = asTitle;
    }

    public Boolean getOnlySubordinates() {
        return onlySubordinates;
    }

    public void setOnlySubordinates(Boolean onlySubordinates) {
        this.onlySubordinates = onlySubordinates;
    }
        
    public Integer getMaxDefaultWidth() {
        return maxDefaultWidth;
    }

    public void setMaxDefaultWidth(Integer maxDefaultWidth) {
        this.maxDefaultWidth = maxDefaultWidth;
    }

    public List<FollowUpAction> getFollowUpActions() {
        return followUpActions;
    }

    public void setFollowUpActions(List<FollowUpAction> followUpActions) {
        this.followUpActions = followUpActions;
    }

    public List<Object> getOptions() {
        return options;
    }

    public void setOptions(List<Object> options) {
        this.options = options;
    }
}
