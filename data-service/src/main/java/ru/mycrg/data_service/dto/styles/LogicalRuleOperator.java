package ru.mycrg.data_service.dto.styles;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum LogicalRuleOperator {

    @JsonProperty("And")
    AND,

    @JsonProperty("Or")
    OR,

    @JsonProperty("Not")
    NOT
}
