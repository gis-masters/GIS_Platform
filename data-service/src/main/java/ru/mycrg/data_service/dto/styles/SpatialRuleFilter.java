package ru.mycrg.data_service.dto.styles;

import org.jetbrains.annotations.NotNull;

import static ru.mycrg.data_service.dto.styles.SpacialRuleOperator.INTERSECTS;

public class SpatialRuleFilter implements RuleFilter {

    @NotNull
    private SpacialRuleOperator operator;

    @NotNull
    private String propertyName;

    @NotNull
    private SpatialLiteral literal;

    public SpatialRuleFilter() {
        this.operator = INTERSECTS;
        this.propertyName = "";
        this.literal = new SpatialLiteral();
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
