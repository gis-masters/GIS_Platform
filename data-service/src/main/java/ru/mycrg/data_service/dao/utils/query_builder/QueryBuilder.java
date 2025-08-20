package ru.mycrg.data_service.dao.utils.query_builder;

import com.healthmarketscience.sqlbuilder.*;
import com.healthmarketscience.sqlbuilder.custom.postgresql.PgLimitClause;
import org.jetbrains.annotations.NotNull;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import org.springframework.lang.Nullable;
import ru.mycrg.data_service.dao.utils.query_builder.exceptions.QueryBuilderException;
import ru.mycrg.data_service.dao.utils.query_builder.rule_handlers.RuleMappersFactory;
import ru.mycrg.data_service.dto.styles.RuleFilter;
import ru.mycrg.data_service.dto.styles.SpatialRuleFilter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;

public class QueryBuilder {

    private static final RuleMappersFactory ruleMappersFactory = new RuleMappersFactory();

    private QueryBuilder() {
        throw new IllegalStateException("Utility class");
    }

    public static String buildSelectQueryWithBbox(ResourceQualifier tQualifier,
                                                  List<RuleFilter> filters,
                                                  SpatialRuleFilter bboxFilter,
                                                  String ecqlFilter) {
        try {
            ComboCondition comboCondition = prepareComboCondition(filters, bboxFilter, ecqlFilter, false);

            String propNames = String.join(",", getFields(filters));

            return new SelectQuery(true)
                    .addCustomFromTable(tQualifier.getQualifier())
                    .addCustomColumns("columnsTemplate")
                    .addCondition(comboCondition).toString()
                    .replace("'columnsTemplate'", propNames.isBlank() ? "*" : propNames);
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build 'selectQueryWithBbox'. Reason: " + e.getMessage());
        }
    }

    public static String buildSelectNotQueryWithBbox(ResourceQualifier tQualifier,
                                                     List<RuleFilter> filters,
                                                     SpatialRuleFilter bboxFilter,
                                                     String ecqlFilter) {
        try {
            ComboCondition comboCondition = prepareComboCondition(filters, bboxFilter, ecqlFilter, true);

            String propNames = String.join(",", getFields(filters));

            return new SelectQuery(true)
                    .addCustomFromTable(tQualifier.getQualifier())
                    .addCustomColumns("columnsTemplate")
                    .addCondition(comboCondition).toString()
                    .replace("'columnsTemplate'", propNames.isBlank() ? "*" : propNames);
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build 'selectQueryWithBbox'. Reason: " + e.getMessage());
        }
    }

    public static String buildSelectOneQueryWithBbox(ResourceQualifier tQualifier,
                                                     SpatialRuleFilter bboxFilter,
                                                     String ecqlFilter) {
        try {
            ComboCondition comboCondition = prepareComboCondition(null, bboxFilter, ecqlFilter, false);

            return new SelectQuery()
                    .addCustomFromTable(tQualifier.getQualifier())
                    .addAllColumns()
                    .addCondition(comboCondition)
                    .addCustomization(new PgLimitClause(1))
                    .toString();
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build 'selectOneQueryWithBbox'. Reason: " + e.getMessage());
        }
    }

    @NotNull
    private static ComboCondition prepareComboCondition(@Nullable List<RuleFilter> filters,
                                                        SpatialRuleFilter bboxFilter,
                                                        String ecqlFilter,
                                                        boolean invertRuleFilter)
            throws FactoryException, TransformException {
        ComboCondition resultCondition = ComboCondition.and();

        if (filters != null) {
            ComboCondition legendFilterCondition = ComboCondition.or();
            for (RuleFilter filter: filters) {
                legendFilterCondition.addCondition(mapToCondition(filter));
            }

            if (invertRuleFilter) {
                resultCondition.addCondition(new NotCondition(legendFilterCondition));
            } else {
                resultCondition.addCondition(legendFilterCondition);
            }
        }

        if (bboxFilter != null) {
            resultCondition.addCondition(mapToCondition(bboxFilter));
        }

        if (ecqlFilter != null && !ecqlFilter.isBlank()) {
            resultCondition.addCondition(new CustomCondition(buildWhereSection(ecqlFilter).replace("WHERE", "")));
        }

        return resultCondition;
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
