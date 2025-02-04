package ru.mycrg.data_service.util.filter;

public class FilterItem {

    private final String field;
    private final String value;
    private final FilterCondition condition;

    public FilterItem(String field, String value, FilterCondition condition) {
        this.field = field;
        this.value = value;
        this.condition = condition;
    }

    public String getField() {
        return field;
    }

    public String getValue() {
        return value;
    }

    public FilterCondition getCondition() {
        return condition;
    }
}
