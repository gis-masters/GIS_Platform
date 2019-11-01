package ru.mycrg.common.propertyTypes;

import ru.mycrg.common.enums.ChoiceType;
import ru.mycrg.common.enums.Updateability;
import ru.mycrg.common.enums.ValueType;

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

    private int sequenceNumber;

    /**
     * <p>Определяет способ обработки пробельных символов:</p><br>
     * 'preserve' - НЕ удалять никакие пробельные символы; <br>
     * 'replace' - ЗАМЕНИТЬ все пробельные символы (символы табуляции, пробела, конца строки и перевода каретки)
     *  символами пробела; <br>
     * 'collapse' - УДАЛИТЬ все пробельные символы (символы табуляции, пробела, конца строки и перевода каретки и
     *  конечного пробела удаляются, а множественные пробелы заменяются на одинарный символ пробела):
     */
    private String whiteSpace;

    /**
     * Определяет точную последовательность приемлемых символов
     */
    private String pattern;

    /**
     * Описание паттерна
     */
    private String patternDescription = "";

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
