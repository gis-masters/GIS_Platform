package ru.mycrg.data_service.entity;

import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "entity_description")
public class EntityDescription {

    @Id
    @Column(length = 64)
    private String tableName;

    @Column
    private String title;

    @Column(length = 500)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String entityValidationFunction;

    @Column(columnDefinition = "TEXT")
    private String calcFieldsFunction;

    @Column
    @ColumnDefault(value = "false")
    private boolean readonly;

    @OneToMany
    @JoinColumn(name = "entity_description_table_name")
    private List<EntityProperty> properties;

    @OneToMany
    @JoinColumn(name = "entity_description_table_name")
    private List<EntityContentType> contentTypes;

    public EntityDescription() {
        // Required
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
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

    public String getEntityValidationFunction() {
        return entityValidationFunction;
    }

    public void setEntityValidationFunction(String entityValidationFunction) {
        this.entityValidationFunction = entityValidationFunction;
    }

    public String getCalcFieldsFunction() {
        return calcFieldsFunction;
    }

    public void setCalcFieldsFunction(String calcFieldsFunction) {
        this.calcFieldsFunction = calcFieldsFunction;
    }

    public boolean isReadonly() {
        return readonly;
    }

    public void setReadonly(boolean readonly) {
        this.readonly = readonly;
    }

    public List<EntityProperty> getProperties() {
        return properties;
    }

    public void setProperties(List<EntityProperty> properties) {
        this.properties = properties;
    }

    public List<EntityContentType> getContentTypes() {
        return contentTypes;
    }

    public void setContentTypes(List<EntityContentType> contentTypes) {
        this.contentTypes = contentTypes;
    }
}
