package ru.mycrg.data_service.dao.query_builder.rule_handlers;

import org.opengis.referencing.FactoryException;
import ru.mycrg.data_service.dto.styles.ComparisonRuleFilter;
import ru.mycrg.data_service.dto.styles.LogicalRuleFilter;
import ru.mycrg.data_service.dto.styles.RuleFilter;
import ru.mycrg.data_service.dto.styles.SpatialRuleFilter;

public class RuleHandlersFactory {

    public RuleHandler suitableHandler(RuleFilter filter) throws FactoryException {
        if (filter instanceof ComparisonRuleFilter) {
            return new ComparisonRuleHandler();
        } else if (filter instanceof LogicalRuleFilter) {
            return new LogicalRuleHandler();
        } else if (filter instanceof SpatialRuleFilter) {
            return new SpatialRuleHandler();
        } else {
            throw new IllegalArgumentException("Unknown filter");
        }
    }
}
