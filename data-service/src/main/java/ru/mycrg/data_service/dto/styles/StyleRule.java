package ru.mycrg.data_service.dto.styles;

public class StyleRule {

    private String name;
    private RuleFilter filter;

    public StyleRule() {
        // Required
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public RuleFilter getFilter() {
        return filter;
    }

    public void setFilter(RuleFilter filter) {
        this.filter = filter;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\": \"" + name + "\"," +
                "\"filter\": " + filter +
                "}";
    }
}
