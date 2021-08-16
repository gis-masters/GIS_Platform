package ru.mycrg.data_service.dao.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import ru.mycrg.data_service.dto.styles.RuleFilter;

public class LogicalRuleHandler implements RuleHandler {

    @Override
    public Condition handle(RuleFilter filter) {
        throw new IllegalArgumentException("Not implemented yet");
    }
}
