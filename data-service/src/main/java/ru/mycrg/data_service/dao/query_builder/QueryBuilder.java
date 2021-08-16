package ru.mycrg.data_service.dao.query_builder;

import com.healthmarketscience.sqlbuilder.ComboCondition;
import com.healthmarketscience.sqlbuilder.Condition;
import com.healthmarketscience.sqlbuilder.SelectQuery;
import org.jetbrains.annotations.Nullable;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.query_builder.rule_handlers.RuleHandlersFactory;
import ru.mycrg.data_service.dto.styles.RuleFilter;
import ru.mycrg.data_service.dto.styles.SpatialRuleFilter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QueryBuilder {

    public static final Logger log = LoggerFactory.getLogger(QueryBuilder.class);

    private final RuleHandlersFactory ruleHandlersFactory;

    public QueryBuilder() {
        ruleHandlersFactory = new RuleHandlersFactory();
    }

    public String selectQuery(ResourceQualifier tQualifier,
                              List<RuleFilter> filters,
                              SpatialRuleFilter bboxFilter) {
        final SelectQuery selectQuery = new SelectQuery(true);
        selectQuery.addCustomFromTable(tQualifier.getQualifier());
        selectQuery.addCustomColumns("columnsTemplate");

        final ComboCondition orCondition = ComboCondition.or();
        filters.stream()
               .map(this::mapToCondition)
               .filter(Objects::nonNull)
               .forEach(orCondition::addCondition);

        final ComboCondition andCondition;
        final Condition bboxCondition = mapToCondition(bboxFilter);
        if (bboxCondition != null) {
            andCondition = ComboCondition.and(orCondition, bboxCondition);
        } else {
            andCondition = ComboCondition.and(orCondition);
        }

        selectQuery.addCondition(andCondition);

        final String propNames = String.join(",", getFields(filters));

        return selectQuery.toString()
                          .replace("'columnsTemplate'", propNames);
    }

    @Nullable
    private Condition mapToCondition(RuleFilter filter) {
        try {
            return ruleHandlersFactory.suitableHandler(filter)
                                      .handle(filter);
        } catch (IllegalArgumentException | FactoryException | TransformException e) {
            log.warn("Failed handle filter: {}", e.getMessage());

            return null;
        }
    }

    private Set<String> getFields(List<RuleFilter> filters) {
        return filters.stream()
                      .filter(Objects::nonNull)
                      .map(RuleFilter::getPropertyName)
                      .collect(Collectors.toSet());
    }
}
