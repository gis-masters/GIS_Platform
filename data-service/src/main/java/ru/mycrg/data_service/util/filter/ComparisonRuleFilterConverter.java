package ru.mycrg.data_service.util.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.styles.RuleFilter;

import java.util.Optional;

public class ComparisonRuleFilterConverter implements RuleFilterConverter {

    public static final Logger log = LoggerFactory.getLogger(ComparisonRuleFilterConverter.class);

    @Override
    public Optional<CrgFilter> convert(RuleFilter ruleFilter) {
        return Optional.empty();
    }
}
