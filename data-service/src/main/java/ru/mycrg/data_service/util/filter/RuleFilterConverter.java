package ru.mycrg.data_service.util.filter;

import ru.mycrg.data_service.dto.styles.RuleFilter;

import java.util.Optional;

public interface RuleFilterConverter {

    Optional<CrgFilter> convert(RuleFilter ruleFilter);
}
