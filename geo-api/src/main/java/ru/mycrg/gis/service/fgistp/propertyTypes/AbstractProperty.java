package ru.mycrg.gis.service.fgistp.propertyTypes;

import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.service.fgistp.enums.ChoiceType;
import ru.mycrg.gis.service.fgistp.enums.Updateability;
import ru.mycrg.gis.service.fgistp.enums.ValueType;

public abstract class AbstractProperty {

    private String name;
    private String title;
    private String description;

    private boolean required;
    private boolean hidden;

    private Updateability updateability;
    private boolean isMultiple;
    private ChoiceType choice;
    private ValueType valueType;

    public AbstractProperty() {}

    public AbstractProperty(String name) {
        this.name = name;
    }

    public AbstractProperty(ValueType valueType) {
        this.valueType = valueType;
    }

    public AbstractProperty(String name, ValueType valueType) {
        this.name = name;
        this.valueType = valueType;
    }

    public AbstractProperty(SimplePropertyDto propertyDto) {
        this.name = propertyDto.getName();
        this.title = propertyDto.getTitle();
        this.description = propertyDto.getDescription();
        this.required = propertyDto.isRequired();
        this.hidden = propertyDto.isHidden();
        this.updateability = propertyDto.getUpdateability();
        this.isMultiple = propertyDto.isMultiple();
        this.choice = propertyDto.getChoice();
        this.valueType = propertyDto.getValueType();
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

    public boolean isGeometry() {
        return this.valueType == ValueType.GEOMETRY;
    }
}
