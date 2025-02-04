package ru.mycrg.schemas.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import ru.mycrg.schemas.GeometryType;
import ru.mycrg.schemas.content_types.EntityContentTypeResponseModel;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class EntityDescriptionResponseModel {

    private String tableName;
    private String customRuleFunction;
    private String calcFieldsFunction;
    private boolean readOnly;
    private GeometryType geometryType;
    private List<EntityPropertyResponseModel> properties = new ArrayList<>();
    private List<EntityContentTypeResponseModel> contentTypes = new ArrayList<>();

    public EntityDescriptionResponseModel() {
        // Required
    }

    public EntityDescriptionResponseModel(String tableName) {
        this.tableName = tableName;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getCustomRuleFunction() {
        return customRuleFunction;
    }

    public void setCustomRuleFunction(String customRuleFunction) {
        this.customRuleFunction = customRuleFunction;
    }

    public String getCalcFieldsFunction() {
        return calcFieldsFunction;
    }

    public void setCalcFieldsFunction(String calcFieldsFunction) {
        this.calcFieldsFunction = calcFieldsFunction;
    }

    public boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(boolean readOnly) {
        this.readOnly = readOnly;
    }

    public GeometryType getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(GeometryType geometryType) {
        this.geometryType = geometryType;
    }

    public List<EntityPropertyResponseModel> getProperties() {
        return properties;
    }

    public void setProperties(List<EntityPropertyResponseModel> properties) {
        this.properties = properties;
    }

    public List<EntityContentTypeResponseModel> getContentTypes() {
        return contentTypes;
    }

    public void setContentTypes(List<EntityContentTypeResponseModel> contentTypes) {
        this.contentTypes = contentTypes;
    }
}
