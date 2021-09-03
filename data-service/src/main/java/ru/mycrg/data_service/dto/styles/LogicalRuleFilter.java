package ru.mycrg.data_service.dto.styles;

import java.util.ArrayList;
import java.util.List;

public class LogicalRuleFilter implements RuleFilter {

    private LogicalRuleOperator operator;
    private List<RuleFilter> filters = new ArrayList<>();

    public LogicalRuleFilter() {
        // Required
    }

    public LogicalRuleOperator getOperator() {
        return operator;
    }

    public void setOperator(LogicalRuleOperator operator) {
        this.operator = operator;
    }

    public List<RuleFilter> getFilters() {
        return filters;
    }

    public void setFilters(List<RuleFilter> filters) {
        this.filters = filters;
    }

    @Override
    public String toString() {
        return "{" +
                "\"operator\": \"" + operator + "\"," +
                "\"filters\": " + filters +
                "}";
    }

    @Override
    public String getPropertyName() {
        return null;
    }
}
