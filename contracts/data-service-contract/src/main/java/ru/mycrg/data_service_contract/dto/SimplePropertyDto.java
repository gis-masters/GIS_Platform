package ru.mycrg.data_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import ru.mycrg.data_service_contract.enums.ChoiceType;
import ru.mycrg.data_service_contract.enums.ForeignKeyType;
import ru.mycrg.data_service_contract.enums.Updateability;
import ru.mycrg.data_service_contract.enums.ValueType;

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

    private boolean readOnly;

    private Updateability updateability;
    private boolean multiple;
    private ChoiceType choice;
    private ValueType valueType;
    private ForeignKeyType foreignKeyType;

    private String resourcePath;
    private String folderId;
    private String whiteSpace;
    private String pattern;
    private String patternDescription = "";
    private String accept;
    private String library;
    
    private String dateFormat;
    private String displayMode;
    private String display;
    
    private String searchMode;
    
    private int sequenceNumber;

    private String calculatedValueFormula;
    private String calculatedValueWellKnownFormula;
    private Object valueFormulaParams;

    private Integer length = -1;
    private Integer minLength = -1;
    private Integer maxLength = -1;
    private Integer minInclusive = -1;
    private Integer maxInclusive = -1;
    private Integer totalDigits = -1;
    private Integer fractionDigits = -1;
    private Integer minWidth = 0;
    private Integer maxSize;
    private Integer maxFiles;
    private Integer maxDocuments;
    private List<ValueTitleProjection> enumerations = new ArrayList<>();
    private List<String> allowedValues = new ArrayList<>();

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

    public boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(boolean readOnly) {
        this.readOnly = readOnly;
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

    public String getLibrary() {
        return library;
    }

    public void setLibrary(String library) {
        this.library = library;
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
        return this.valueType == ValueType.GEOMETRY;
    }
}
