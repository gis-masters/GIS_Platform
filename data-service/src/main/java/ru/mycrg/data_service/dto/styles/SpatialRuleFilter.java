package ru.mycrg.data_service.dto.styles;

public class SpatialRuleFilter implements RuleFilter {

    private SpacialRuleOperator operator;
    private String propertyName;
    private SpatialLiteral literal;

    public SpatialRuleFilter() {
        // Required
    }

    public SpacialRuleOperator getOperator() {
        return operator;
    }

    public void setOperator(SpacialRuleOperator operator) {
        this.operator = operator;
    }

    @Override
    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public SpatialLiteral getLiteral() {
        return literal;
    }

    public void setLiteral(SpatialLiteral literal) {
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
