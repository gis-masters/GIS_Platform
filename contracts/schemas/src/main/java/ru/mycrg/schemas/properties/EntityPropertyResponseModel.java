package ru.mycrg.schemas.properties;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class EntityPropertyResponseModel {

    // Unique
    private String name;
    private String propertyType;
    private String title;

    // Common
    private String description;
    private String category;
    private Boolean isSystemManaged;
    private Boolean hidden;
    private Boolean disabled;
    private Boolean required;
    private Boolean asTitle;
    private Boolean isIndexed;
    private String createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastModified = LocalDateTime.now();

    // Specific
    private String display;
    private String mask;
    private Double minLength;
    private Double maxLength;
    private String wellKnowRegex;
    private String regex;
    private String regexErrorMessage;
    private String defaultValue;
    private Boolean allowMultipleValues;
    private Integer step;
    private Integer minValue;
    private Integer maxValue;
    private Integer precision;
    private String trueLabel;
    private String falseLabel;
    private String format;
    private String valueType;
    private Boolean allowFillIn;
    private Boolean multiple;
    private Boolean enablePreview;
    private String wellKnowFormula;
    private String formula;
    private String geometryType;
    private Boolean isDefaultGeometry;
    private String lookupTableName;
    private String lookupFieldName;
    private String additionalFields;
    private String accept;
    private Integer maxSize;
    private Boolean isDefault;
    private Boolean isEmbedded;

    private Object fields;
    private Object options;

    public EntityPropertyResponseModel() {
        // Framework required
    }

    public EntityPropertyResponseModel(String name, String propertyType, String title, String description,
                                       String category, boolean isSystemManaged, boolean hidden,
                                       boolean disabled,
                                       boolean required, boolean asTitle, boolean isIndexed) {
        this.name = name;
        this.propertyType = propertyType;
        this.title = title;
        this.description = description;
        this.category = category;
        this.isSystemManaged = isSystemManaged;
        this.hidden = hidden;
        this.disabled = disabled;
        this.required = required;
        this.asTitle = asTitle;
        this.isIndexed = isIndexed;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getSystemManaged() {
        return isSystemManaged;
    }

    public void setSystemManaged(Boolean systemManaged) {
        isSystemManaged = systemManaged;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public Boolean getDisabled() {
        return disabled;
    }

    public void setDisabled(Boolean disabled) {
        this.disabled = disabled;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Boolean getAsTitle() {
        return asTitle;
    }

    public void setAsTitle(Boolean asTitle) {
        this.asTitle = asTitle;
    }

    public Boolean getIndexed() {
        return isIndexed;
    }

    public void setIndexed(Boolean indexed) {
        isIndexed = indexed;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    public String getMask() {
        return mask;
    }

    public void setMask(String mask) {
        this.mask = mask;
    }

    public Double getMinLength() {
        return minLength;
    }

    public void setMinLength(Double minLength) {
        this.minLength = minLength;
    }

    public Double getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(Double maxLength) {
        this.maxLength = maxLength;
    }

    public String getWellKnowRegex() {
        return wellKnowRegex;
    }

    public void setWellKnowRegex(String wellKnowRegex) {
        this.wellKnowRegex = wellKnowRegex;
    }

    public String getRegex() {
        return regex;
    }

    public void setRegex(String regex) {
        this.regex = regex;
    }

    public String getRegexErrorMessage() {
        return regexErrorMessage;
    }

    public void setRegexErrorMessage(String regexErrorMessage) {
        this.regexErrorMessage = regexErrorMessage;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public Boolean getAllowMultipleValues() {
        return allowMultipleValues;
    }

    public void setAllowMultipleValues(Boolean allowMultipleValues) {
        this.allowMultipleValues = allowMultipleValues;
    }

    public Integer getStep() {
        return step;
    }

    public void setStep(Integer step) {
        this.step = step;
    }

    public Integer getMinValue() {
        return minValue;
    }

    public void setMinValue(Integer minValue) {
        this.minValue = minValue;
    }

    public Integer getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(Integer maxValue) {
        this.maxValue = maxValue;
    }

    public Integer getPrecision() {
        return precision;
    }

    public void setPrecision(Integer precision) {
        this.precision = precision;
    }

    public String getTrueLabel() {
        return trueLabel;
    }

    public void setTrueLabel(String trueLabel) {
        this.trueLabel = trueLabel;
    }

    public String getFalseLabel() {
        return falseLabel;
    }

    public void setFalseLabel(String falseLabel) {
        this.falseLabel = falseLabel;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getValueType() {
        return valueType;
    }

    public void setValueType(String valueType) {
        this.valueType = valueType;
    }

    public Boolean getAllowFillIn() {
        return allowFillIn;
    }

    public void setAllowFillIn(Boolean allowFillIn) {
        this.allowFillIn = allowFillIn;
    }

    public Boolean getMultiple() {
        return multiple;
    }

    public void setMultiple(Boolean multiple) {
        this.multiple = multiple;
    }

    public Boolean getEnablePreview() {
        return enablePreview;
    }

    public void setEnablePreview(Boolean enablePreview) {
        this.enablePreview = enablePreview;
    }

    public String getWellKnowFormula() {
        return wellKnowFormula;
    }

    public void setWellKnowFormula(String wellKnowFormula) {
        this.wellKnowFormula = wellKnowFormula;
    }

    public String getFormula() {
        return formula;
    }

    public void setFormula(String formula) {
        this.formula = formula;
    }

    public String getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public Boolean getDefaultGeometry() {
        return isDefaultGeometry;
    }

    public void setDefaultGeometry(Boolean defaultGeometry) {
        isDefaultGeometry = defaultGeometry;
    }

    public String getLookupTableName() {
        return lookupTableName;
    }

    public void setLookupTableName(String lookupTableName) {
        this.lookupTableName = lookupTableName;
    }

    public String getLookupFieldName() {
        return lookupFieldName;
    }

    public void setLookupFieldName(String lookupFieldName) {
        this.lookupFieldName = lookupFieldName;
    }

    public String getAdditionalFields() {
        return additionalFields;
    }

    public void setAdditionalFields(String additionalFields) {
        this.additionalFields = additionalFields;
    }

    public String getAccept() {
        return accept;
    }

    public void setAccept(String accept) {
        this.accept = accept;
    }

    public Integer getMaxSize() {
        return maxSize;
    }

    public void setMaxSize(Integer maxSize) {
        this.maxSize = maxSize;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    public Boolean getEmbedded() {
        return isEmbedded;
    }

    public void setEmbedded(Boolean embedded) {
        isEmbedded = embedded;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public Object getOptions() {
        return options;
    }

    public void setOptions(Object options) {
        this.options = options;
    }

    public Object getFields() {
        return fields;
    }

    public void setFields(Object fields) {
        this.fields = fields;
    }
}
