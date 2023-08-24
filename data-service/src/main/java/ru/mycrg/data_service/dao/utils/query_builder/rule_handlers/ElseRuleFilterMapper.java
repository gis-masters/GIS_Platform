package ru.mycrg.data_service.dao.utils.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import com.healthmarketscience.sqlbuilder.CustomCondition;
import com.healthmarketscience.sqlbuilder.CustomSql;
import ru.mycrg.data_service.dto.styles.RuleFilter;

public class ElseRuleFilterMapper implements RuleMapper {

    @Override
    public Condition map(RuleFilter ruleFilter) {
        return new CustomCondition(new CustomSql(true));
    }
}
