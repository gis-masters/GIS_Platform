package ru.mycrg.data_service.dao.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import com.healthmarketscience.sqlbuilder.CustomCondition;
import com.healthmarketscience.sqlbuilder.CustomSql;
import ru.mycrg.data_service.dto.styles.RuleFilter;

public class CommonRuleFilterMapper implements RuleMapper {

    @Override
    public Condition map(RuleFilter filter) {
        return new CustomCondition(new CustomSql(true));
    }
}
