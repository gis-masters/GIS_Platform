package ru.mycrg.gis.dto.fgistp.types;

import ru.mycrg.gis.dto.fgistp.ChoiceType;
import ru.mycrg.gis.dto.fgistp.Updateability;
import ru.mycrg.gis.dto.fgistp.ValueType;

public abstract class SimplePropertyBase {

    private String name;
    private String title;
    private String description;

    private boolean required;
    private boolean hidden;

    private Updateability updateability;
    private boolean isMultiple;
    private ChoiceType choice;
    private ValueType valueType;

    public SimplePropertyBase() {}

    public SimplePropertyBase(String name) {
        this.name = name;
    }

    public SimplePropertyBase(ValueType valueType) {
        this.valueType = valueType;
    }

    public SimplePropertyBase(String name, ValueType valueType) {
        this.name = name;
        this.valueType = valueType;
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
}
