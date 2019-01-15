package ru.mycrg.gis.dto.fgistp.types;

public class FgistpString extends FgistpBaseType {

    private Integer minLength = -1;
    private Integer maxLength = -1;
    private String pattern;
    private String pattern_description = "";

    public FgistpString() {}

    public Integer getMinLength() {
        return minLength;
    }

    public void setMinLength(Integer minLength) {
        this.minLength = minLength;
    }

    public Integer getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(Integer maxLength) {
        this.maxLength = maxLength;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getPattern_description() {
        return pattern_description;
    }

    public void setPattern_description(String pattern_description) {
        this.pattern_description = pattern_description;
    }
}
