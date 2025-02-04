package ru.mycrg.data_service.dto.styles;

public class ElseRuleFilter implements RuleFilter {

    private ElseRuleOperator operator;

    public ElseRuleFilter() {
        // Required
    }

    public ElseRuleOperator getOperator() {
        return operator;
    }

    public void setOperator(ElseRuleOperator operator) {
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
