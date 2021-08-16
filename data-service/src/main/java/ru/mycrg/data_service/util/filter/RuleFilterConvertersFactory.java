package ru.mycrg.data_service.util.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.styles.ComparisonRuleFilter;
import ru.mycrg.data_service.dto.styles.LogicalRuleFilter;
import ru.mycrg.data_service.dto.styles.RuleFilter;
import ru.mycrg.data_service.dto.styles.SpatialRuleFilter;

public class RuleFilterConvertersFactory {

    public static final Logger log = LoggerFactory.getLogger(RuleFilterConvertersFactory.class);

    public RuleFilterConverter getSuitableConverter(RuleFilter ruleFilter) {
        if (ruleFilter instanceof ComparisonRuleFilter) {
            return new ComparisonRuleFilterConverter();
        } else if (ruleFilter instanceof LogicalRuleFilter) {
            return new LogicalRuleFilterConverter();
        } else if (ruleFilter instanceof SpatialRuleFilter) {
            return new SpatialRuleFilterConverter();
        } else {
            throw new IllegalStateException("Unknown ruleFilter");
        }
    }
}
