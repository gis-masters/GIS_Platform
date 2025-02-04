package ru.mycrg.schemas.properties;

public class PropertyInt extends PropertyBase {

    private NumberDisplay display;
    private int minValue;
    private int maxValue;
    private int step;
    private boolean allowMultipleValues;
    private int defaultValue;

    public PropertyInt() {
        super();
    }

    public NumberDisplay getDisplay() {
        return display;
    }

    public void setDisplay(NumberDisplay display) {
        this.display = display;
    }

    public int getMinValue() {
        return minValue;
    }

    public void setMinValue(int minValue) {
        this.minValue = minValue;
    }

    public int getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(int maxValue) {
        this.maxValue = maxValue;
    }

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public boolean isAllowMultipleValues() {
        return allowMultipleValues;
    }

    public void setAllowMultipleValues(boolean allowMultipleValues) {
        this.allowMultipleValues = allowMultipleValues;
    }

    public int getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(int defaultValue) {
        this.defaultValue = defaultValue;
    }
}
