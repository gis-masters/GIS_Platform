package ru.mycrg.data_service.util.filter;

import ru.mycrg.data_service.dto.styles.RuleFilter;

import java.util.Optional;

public class SpatialRuleFilterConverter implements RuleFilterConverter {

    @Override
    public Optional<CrgFilter> convert(RuleFilter ruleFilter) {
        return Optional.of(new CrgFilter());
    }
}
