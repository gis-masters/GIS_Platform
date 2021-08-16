package ru.mycrg.data_service.dto.styles;

public class ComparisonRuleFilter implements RuleFilter {

    public ComparisonRuleOperator operator;
    public String propertyName;
    public String literal;

    public ComparisonRuleFilter() {
        // Required
    }

    public ComparisonRuleOperator getOperator() {
        return operator;
    }

    public void setOperator(ComparisonRuleOperator operator) {
        this.operator = operator;
    }

    @Override
    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getLiteral() {
        return literal;
    }

    public void setLiteral(String literal) {
        this.literal = literal;
    }

    @Override
    public String toString() {
        return "{" +
                "\"operator\": \"" + operator + "\"," +
                "\"propertyName\": \"" + propertyName + "\"," +
                "\"literal\": " + literal +
                "}";
    }
}
