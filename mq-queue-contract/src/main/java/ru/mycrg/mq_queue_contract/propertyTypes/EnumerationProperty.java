package ru.mycrg.mq_queue_contract.propertyTypes;

import ru.mycrg.mq_queue_contract.enums.ValueType;

import java.util.ArrayList;
import java.util.List;

public class EnumerationProperty extends AbstractProperty {

    private List<ValueTitleProjection> enumerations = new ArrayList<>();

    public EnumerationProperty() {
        super(ValueType.CHOICE);
    }

    public EnumerationProperty(String name) {
        super(name);
    }

    public List<ValueTitleProjection> getEnumerations() {
        return enumerations;
    }

    public void setEnumerations(List<ValueTitleProjection> enumerations) {
        this.enumerations = enumerations;
    }

    public void addValue(int value) {
        enumerations.add(new ValueTitleProjection(String.valueOf(value), ""));
    }
}
