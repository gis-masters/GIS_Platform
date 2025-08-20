package ru.mycrg.data_service.dao.utils.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import com.healthmarketscience.sqlbuilder.CustomSql;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.styles.ComparisonRuleFilter;
import ru.mycrg.data_service.dto.styles.ComparisonRuleOperator;
import ru.mycrg.data_service.dto.styles.RuleFilter;

import static com.healthmarketscience.sqlbuilder.BinaryCondition.*;

public class ComparisonRuleMapper implements RuleMapper {

    private final Logger log = LoggerFactory.getLogger(ComparisonRuleMapper.class);

    @Override
    public Condition map(RuleFilter ruleFilter) {
        log.info("ComparisonRuleHandler");

        final ComparisonRuleFilter filter = (ComparisonRuleFilter) ruleFilter;
        final ComparisonRuleOperator operator = filter.getOperator();
        final String propertyName = filter.getPropertyName();
        final String value = filter.getLiteral();

        switch (operator) {
            case IS_EQUAL_TO:
                return equalTo(new CustomSql(propertyName), value);
            case IS_NOT_EQUAL_TO:
                return notEqualTo(new CustomSql(propertyName), value);
            case IS_LESS_THEN:
                return lessThan(new CustomSql(propertyName), value);
            case IS_LESS_THEN_OR_EQUAL_TO:
                return lessThan(new CustomSql(propertyName), value, true);
            case IS_GREATER_THEN:
                return greaterThan(new CustomSql(propertyName), value);
            case IS_GREATER_THEN_OR_EQUAL_TO:
                return greaterThan(new CustomSql(propertyName), value, true);
            case IS_LIKE:
                return like(new CustomSql(propertyName), value);
            default:
                final String msg = "Unknown ComparisonRuleOperator: " + operator;
                log.warn(msg);

                throw new IllegalArgumentException(msg);
        }
    }
}
