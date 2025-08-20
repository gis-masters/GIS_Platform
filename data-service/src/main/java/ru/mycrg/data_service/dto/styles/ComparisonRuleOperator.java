package ru.mycrg.data_service.dto.styles;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ComparisonRuleOperator {

    @JsonProperty("PropertyIsEqualTo")
    IS_EQUAL_TO,

    @JsonProperty("PropertyIsNotEqualTo")
    IS_NOT_EQUAL_TO,

    @JsonProperty("PropertyIsLessThan")
    IS_LESS_THEN,

    @JsonProperty("PropertyIsLessThanOrEqualTo")
    IS_LESS_THEN_OR_EQUAL_TO,

    @JsonProperty("PropertyIsGreaterThan")
    IS_GREATER_THEN,

    @JsonProperty("PropertyIsGreaterThanOrEqualTo")
    IS_GREATER_THEN_OR_EQUAL_TO,

    @JsonProperty("PropertyIsLike")
    IS_LIKE,

    @JsonProperty("PropertyIsNull")
    IS_NULL,

    @JsonProperty("PropertyIsBetween")
    IS_BETWEEN
}
