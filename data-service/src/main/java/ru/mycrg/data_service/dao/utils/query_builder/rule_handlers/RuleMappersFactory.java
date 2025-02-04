package ru.mycrg.data_service.dao.utils.query_builder.rule_handlers;

import org.opengis.referencing.FactoryException;
import ru.mycrg.data_service.dto.styles.*;

public class RuleMappersFactory {

    public RuleMapper suitableMapper(RuleFilter filter) throws FactoryException {
        if (filter instanceof ComparisonRuleFilter) {
            return new ComparisonRuleMapper();
        } else if (filter instanceof LogicalRuleFilter) {
            return new LogicalRuleMapper();
        } else if (filter instanceof SpatialRuleFilter) {
            return new SpatialRuleMapper();
        } else if (filter instanceof ElseRuleFilter) {
            return new ElseRuleFilterMapper();
        } else {
            throw new IllegalArgumentException("Unknown filter");
        }
    }
}
