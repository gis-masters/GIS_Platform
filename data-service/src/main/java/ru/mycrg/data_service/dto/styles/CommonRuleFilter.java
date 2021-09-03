package ru.mycrg.data_service.dto.styles;

public class CommonRuleFilter implements RuleFilter {

    private String operator;

    public CommonRuleFilter() {
        // Required
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    @Override
    public String getPropertyName() {
        return null;
    }

    @Override
    public String toString() {
        return "{" +
                "\"operator\": \"" + operator +
                "}";
    }
}
