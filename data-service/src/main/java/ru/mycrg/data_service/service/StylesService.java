package ru.mycrg.data_service.service;

import com.healthmarketscience.sqlbuilder.*;
import com.healthmarketscience.sqlbuilder.custom.postgresql.PgLimitClause;
import org.jetbrains.annotations.NotNull;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.query_builder.exceptions.QueryBuilderException;
import ru.mycrg.data_service.dao.query_builder.rule_handlers.RuleMappersFactory;
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.dto.styles.*;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.validators.ComparisonRuleValidator.validate;

@Service
public class StylesService {

    private static final Logger log = LoggerFactory.getLogger(StylesService.class);

    private final TablesDao tablesDao;
    private final RuleMappersFactory ruleMappersFactory;

    public StylesService(TablesDao tablesDao) {
        this.tablesDao = tablesDao;

        this.ruleMappersFactory = new RuleMappersFactory();
    }

    public List<ActualStylesResponseModel> defineActualStyles(List<ActualStylesRequestModel> request) {
        return request.stream()
                      .map(this::defineActualStyle)
                      .collect(Collectors.toList());
    }

    public ActualStylesResponseModel defineActualStyle(ActualStylesRequestModel requestModel) {
        ActualStylesResponseModel response = new ActualStylesResponseModel(requestModel);
        final ResourceQualifier tQualifier = new ResourceQualifier(requestModel.getDataset(),
                                                                   requestModel.getIdentifier());
        final List<StyleRule> styleRules = requestModel.getRules();
        final List<RuleFilter> ruleFilters = styleRules.stream()
                                                       .map(StyleRule::getFilter)
                                                       .collect(Collectors.toList());
        if (ruleFilters.contains(null)) {
            throw new BadRequestException("Some rule is not correct");
        }

        try {
            final SpatialRuleFilter bboxFilter = requestModel.getFilter();

            if (isCommonRuleExist(ruleFilters)) {
                final String sqlQuery = buildQueryByCommonRule(tQualifier, bboxFilter);
                final List<Record> records = tablesDao.customListQuery(sqlQuery);
                if (!records.isEmpty()) {
                    styleRules.stream()
                               .filter(styleRule -> styleRule.getFilter() instanceof CommonRuleFilter)
                               .findFirst()
                               .ifPresent(styleRule -> response.addRule(styleRule.getName()));
                }
            } else {
                final String sqlQuery = buildQuery(tQualifier, ruleFilters, bboxFilter);
                final List<Record> records = tablesDao.customListQuery(sqlQuery);

                analyzeComparisonRule(styleRules, records, response);
                analyzeElseRule(styleRules, ruleFilters, response, bboxFilter);
            }

            return response;
        } catch (BadSqlGrammarException e) {
            String msg = "Failed to define actual styles";
            final Throwable cause = e.getCause();
            if (cause != null) {
                throw new DataServiceException(msg, new ErrorInfo("sqlQuery", cause.getMessage()));
            }

            throw new DataServiceException(msg);
        } catch (Exception e) {
            final String msg = "Failed to define actual styles. Reason: " + e.getMessage();
            log.error(msg, e.getCause());

            throw new DataServiceException(msg);
        }
    }

    private void analyzeComparisonRule(List<StyleRule> rules,
                                       List<Record> records,
                                       ActualStylesResponseModel response) {
        records.forEach(record -> {
            final Map<String, Object> recordContent = record.getContent();

            rules.stream()
                 .filter(styleRule -> styleRule.getFilter() instanceof ComparisonRuleFilter)
                 .forEach(styleRule -> {
                     final ComparisonRuleFilter filter = (ComparisonRuleFilter) styleRule.getFilter();
                     final String propertyName = filter.getPropertyName();
                     if (recordContent.containsKey(propertyName)) {
                         final String recordValue = (String) recordContent.get(propertyName);
                         if (validate(filter, recordValue)) {
                             response.addRule(styleRule.getName());
                         }
                     }
                 });
        });
    }

    private void analyzeElseRule(List<StyleRule> styleRules,
                                 List<RuleFilter> ruleFilters,
                                 ActualStylesResponseModel response,
                                 SpatialRuleFilter bboxFilter) {
        final Optional<StyleRule> oElseRule = styleRules.stream()
                                                        .filter(styleRule -> styleRule.getFilter() instanceof ElseRuleFilter)
                                                        .findFirst();
        if (oElseRule.isPresent()) {
            final List<String> filterValues = ruleFilters.stream()
                                                         .filter(rule -> rule instanceof ComparisonRuleFilter)
                                                         .map(ruleFilter -> (ComparisonRuleFilter) ruleFilter)
                                                         .map(ComparisonRuleFilter::getLiteral)
                                                         .collect(Collectors.toList());

            final ResourceQualifier tQualifier = new ResourceQualifier(response.getDataset(),
                                                                       response.getIdentifier());
            if (isDataByElseRuleExist(tQualifier, filterValues, bboxFilter)) {
                response.addRule(oElseRule.get().getName());
            }
        }
    }

    private boolean isDataByElseRuleExist(ResourceQualifier tQualifier,
                                          List<String> filterValues,
                                          SpatialRuleFilter bboxFilter) {
        final String elseQuery = buildElseQueryWithBbox(tQualifier, "ruleid", filterValues, bboxFilter);

        final List<Record> records = tablesDao.customListQuery(elseQuery);

        return !records.isEmpty();
    }

    private String buildQuery(ResourceQualifier tQualifier,
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
                    .replace("'columnsTemplate'", propNames);
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build query. Reason: " + e.getMessage());
        }
    }

    private String buildQueryByCommonRule(ResourceQualifier tQualifier, SpatialRuleFilter bboxFilter) {
        try {
            return new SelectQuery()
                    .addCustomFromTable(tQualifier.getQualifier())
                    .addAllColumns()
                    .addCondition(mapToCondition(bboxFilter))
                    .addCustomization(new PgLimitClause(1))
                    .toString();
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build query by common rule. Reason: " + e.getMessage());
        }
    }

    private String buildElseQueryWithBbox(ResourceQualifier tQualifier,
                                          String propertyName,
                                          List<String> values,
                                          SpatialRuleFilter bboxFilter) {
        try {
            final SelectQuery selectQuery = new SelectQuery();
            selectQuery.addAllColumns();
            selectQuery.addCustomFromTable(tQualifier.getQualifier());

            final InCondition inCondition = new InCondition(new CustomSql(propertyName), values);
            final NotCondition notCondition = new NotCondition(inCondition);

            selectQuery.addCondition(
                    ComboCondition.and(notCondition, mapToCondition(bboxFilter))
            );

            return selectQuery.toString();
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build query. Reason: " + e.getMessage());
        }
    }

    @NotNull
    private Condition mapToCondition(RuleFilter filter) throws FactoryException, TransformException {
        return ruleMappersFactory.suitableMapper(filter)
                                 .map(filter);
    }

    private Set<String> getFields(List<RuleFilter> filters) {
        return filters.stream()
                      .filter(Objects::nonNull)
                      .map(RuleFilter::getPropertyName)
                      .filter(Objects::nonNull)
                      .collect(Collectors.toSet());
    }

    private boolean isCommonRuleExist(List<RuleFilter> ruleFilters) {
        return ruleFilters.stream().anyMatch(ruleFilter -> ruleFilter instanceof CommonRuleFilter);
    }
}
