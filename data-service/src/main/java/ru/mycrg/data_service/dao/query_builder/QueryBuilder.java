package ru.mycrg.data_service.dao.query_builder;

import com.healthmarketscience.sqlbuilder.*;
import com.healthmarketscience.sqlbuilder.custom.postgresql.PgLimitClause;
import org.jetbrains.annotations.NotNull;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import ru.mycrg.data_service.dao.query_builder.exceptions.QueryBuilderException;
import ru.mycrg.data_service.dao.query_builder.rule_handlers.RuleMappersFactory;
import ru.mycrg.data_service.dto.styles.RuleFilter;
import ru.mycrg.data_service.dto.styles.SpatialRuleFilter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class QueryBuilder {

    private static final RuleMappersFactory ruleMappersFactory = new RuleMappersFactory();

    private QueryBuilder() {
        throw new IllegalStateException("Utility class");
    }

    public static String buildSelectQueryWithBbox(ResourceQualifier tQualifier,
                                                  List<RuleFilter> filters,
                                                  SpatialRuleFilter bboxFilter) {
        try {
            final ComboCondition orCondition = ComboCondition.or();
            for (RuleFilter filter: filters) {
                orCondition.addCondition(mapToCondition(filter));
            }

            final String propNames = String.join(",", getFields(filters));

            return new SelectQuery(true)
                    .addCustomFromTable(tQualifier.getQualifier())
                    .addCustomColumns("columnsTemplate")
                    .addCondition(
                            ComboCondition.and(orCondition, mapToCondition(bboxFilter))
                    ).toString()
                    .replace("'columnsTemplate'", propNames.isBlank() ? "*": propNames);
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build 'selectQueryWithBbox'. Reason: " + e.getMessage());
        }
    }

    public static String buildSelectNotQueryWithBbox(ResourceQualifier tQualifier,
                                                     List<RuleFilter> filters,
                                                     SpatialRuleFilter bboxFilter) {
        try {
            final ComboCondition orCondition = ComboCondition.or();
            for (RuleFilter filter: filters) {
                orCondition.addCondition(mapToCondition(filter));
            }

            final String propNames = String.join(",", getFields(filters));

            return new SelectQuery(true)
                    .addCustomFromTable(tQualifier.getQualifier())
                    .addCustomColumns("columnsTemplate")
                    .addCondition(
                            ComboCondition.and(new NotCondition(orCondition), mapToCondition(bboxFilter))
                    ).toString()
                    .replace("'columnsTemplate'", propNames.isBlank() ? "*": propNames);
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build 'selectQueryWithBbox'. Reason: " + e.getMessage());
        }
    }

    public static String buildSelectOneQueryWithBbox(ResourceQualifier tQualifier, SpatialRuleFilter bboxFilter) {
        try {
            return new SelectQuery()
                    .addCustomFromTable(tQualifier.getQualifier())
                    .addAllColumns()
                    .addCondition(mapToCondition(bboxFilter))
                    .addCustomization(new PgLimitClause(1))
                    .toString();
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build 'selectOneQueryWithBbox'. Reason: " + e.getMessage());
        }
    }

    @NotNull
    private static Condition mapToCondition(RuleFilter filter) throws FactoryException, TransformException {
        return ruleMappersFactory.suitableMapper(filter)
                                 .map(filter);
    }

    private static Set<String> getFields(List<RuleFilter> filters) {
        return filters.stream()
                      .filter(Objects::nonNull)
                      .map(RuleFilter::getPropertyName)
                      .filter(Objects::nonNull)
                      .collect(Collectors.toSet());
    }
}
