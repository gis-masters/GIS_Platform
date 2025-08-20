package ru.mycrg.data_service.dao.utils.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import ru.mycrg.data_service.dto.styles.RuleFilter;

public class LogicalRuleMapper implements RuleMapper {

    @Override
    public Condition map(RuleFilter filter) {
        throw new IllegalArgumentException("Not implemented yet");
    }
}
