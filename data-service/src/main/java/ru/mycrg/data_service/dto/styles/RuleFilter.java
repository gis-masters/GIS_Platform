package ru.mycrg.data_service.dto.styles;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "operator", visible = true)
@JsonSubTypes({
        @Type(value = LogicalRuleFilter.class, name = "And"),
        @Type(value = LogicalRuleFilter.class, name = "Or"),
        @Type(value = LogicalRuleFilter.class, name = "Not"),
        @Type(value = SpatialRuleFilter.class, name = "Intersects"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsEqualTo"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsLessThan"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsLessThanOrEqualTo"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsGreaterThan"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsGreaterThanOrEqualTo"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsLike"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsNull"),
        @Type(value = ComparisonRuleFilter.class, name = "PropertyIsBetween"),
        @Type(value = ElseRuleFilter.class, name = "ElseFilter")
})
public interface RuleFilter {

    String getPropertyName();
}
