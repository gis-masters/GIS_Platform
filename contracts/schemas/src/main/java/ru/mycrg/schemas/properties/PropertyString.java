package ru.mycrg.schemas.properties;

public class PropertyString extends PropertyBase {

    private StringDisplay display;
    private String mask;
    private int minLength;
    private int maxLength;
    private String wellKnownRegex;
    private String regex;
    private String defaultValue;

    public PropertyString() {
        super();
    }

    public StringDisplay getDisplay() {
        return display;
    }

    public void setDisplay(StringDisplay display) {
        this.display = display;
    }

    public String getMask() {
        return mask;
    }

    public void setMask(String mask) {
        this.mask = mask;
    }

    public int getMinLength() {
        return minLength;
    }

    public void setMinLength(int minLength) {
        this.minLength = minLength;
    }

    public int getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(int maxLength) {
        this.maxLength = maxLength;
    }

    public String getWellKnownRegex() {
        return wellKnownRegex;
    }

    public void setWellKnownRegex(String wellKnownRegex) {
        this.wellKnownRegex = wellKnownRegex;
    }

    public String getRegex() {
        return regex;
    }

    public void setRegex(String regex) {
        this.regex = regex;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }
}
