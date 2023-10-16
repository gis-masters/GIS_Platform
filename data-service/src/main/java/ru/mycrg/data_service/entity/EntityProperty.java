package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.springframework.data.annotation.LastModifiedDate;
import ru.mycrg.schemas.IEntityProperty;

import javax.persistence.*;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@Entity
@Table(
        name = "entity_properties",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id", "name", "propertyType", "title"})
)
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class EntityProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(length = 50)
    private String name;

    @Column(length = 50)
    private String propertyType;

    @Column
    private String title;

    @Column(length = 500)
    private String description;

    @Column
    private String category;

    @Column
    @ColumnDefault(value = "false")
    private boolean isSystemManaged;

    @Column
    @ColumnDefault(value = "false")
    private boolean hidden;

    @Column
    @ColumnDefault(value = "false")
    private boolean disabled;

    @Column
    @ColumnDefault(value = "false")
    private boolean required;

    @Column
    @ColumnDefault(value = "false")
    private boolean asTitle;

    @Column
    @ColumnDefault(value = "false")
    private boolean isIndexed;

    @Column(length = 50)
    private String display;

    @Column
    private String mask;

    @Column
    private Double minLength;

    @Column
    private Double maxLength;

    @Column(length = 20)
    private String wellKnowRegex;

    @Column
    private String regex;

    @Column
    private String regexErrorMessage;

    @Column
    private String defaultValue;

    @Column
    @ColumnDefault(value = "false")
    private boolean allowMultipleValues;

    @Column
    private Integer step;

    @Column
    private Integer minValue;

    @Column
    private Integer maxValue;

    @Column
    private Integer precision;

    @Column
    private String trueLabel;

    @Column
    private String falseLabel;

    @Column
    private String format;

    @Column(length = 50)
    private String valueType;

    @Column
    @ColumnDefault(value = "false")
    private boolean allowFillIn;

    @Column
    private boolean multiple;

    @Column
    @ColumnDefault(value = "false")
    private boolean enablePreview;

    @Column(length = 1000)
    private String wellKnowFormula;

    @Column(length = 1000)
    private String formula;

    @Column(length = 50)
    private String geometryType;

    @Column
    @ColumnDefault(value = "false")
    private boolean isDefaultGeometry;

    @Column
    private String lookupTableName;

    @Column
    private String lookupFieldName;

    @Column
    private String additionalFields;

    @Column(name = "b_accept")
    private String accept;

    @Column(name = "b_max_size")
    private Integer maxSize;

    @Column
    @ColumnDefault(value = "false")
    private boolean isDefault;

    @Column
    @ColumnDefault(value = "false")
    private boolean isEmbedded;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "json")
    private JsonNode additional;

    @Column(length = 50)
    private String createdBy;

    @Column
    private LocalDateTime createdAt = now();

    @Column
    @LastModifiedDate
    private LocalDateTime lastModified = now();

    public EntityProperty() {
        // Framework required
    }

    public EntityProperty(IEntityProperty entityProperty) {
        this.propertyType = entityProperty.getPropertyType().name();
        this.name = entityProperty.getName();
        this.title = entityProperty.getTitle();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public void setTitleOnUi(String titleOnUi) {
        this.title = titleOnUi;
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

    public boolean isSystemManaged() {
        return isSystemManaged;
    }

    public void setSystemManaged(boolean systemManaged) {
        isSystemManaged = systemManaged;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isAsTitle() {
        return asTitle;
    }

    public void setAsTitle(boolean asTitle) {
        this.asTitle = asTitle;
    }

    public boolean isIndexed() {
        return isIndexed;
    }

    public void setIndexed(boolean indexed) {
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

    public boolean isAllowMultipleValues() {
        return allowMultipleValues;
    }

    public void setAllowMultipleValues(boolean allowMultipleValues) {
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

    public boolean isAllowFillIn() {
        return allowFillIn;
    }

    public void setAllowFillIn(boolean allowFillIn) {
        this.allowFillIn = allowFillIn;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }

    public boolean isEnablePreview() {
        return enablePreview;
    }

    public void setEnablePreview(boolean enablePreview) {
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

    public boolean isDefaultGeometry() {
        return isDefaultGeometry;
    }

    public void setDefaultGeometry(boolean defaultGeometry) {
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

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public boolean isEmbedded() {
        return isEmbedded;
    }

    public void setEmbedded(boolean embedded) {
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

    public JsonNode getAdditional() {
        return additional;
    }

    public void setAdditional(JsonNode additional) {
        this.additional = additional;
    }
}
