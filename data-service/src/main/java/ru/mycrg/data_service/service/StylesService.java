package ru.mycrg.data_service.service;

import com.healthmarketscience.sqlbuilder.*;
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
            final String sqlQuery = selectQueryWithBbox(tQualifier, ruleFilters, bboxFilter);
            final List<Record> records = tablesDao.customListQuery(sqlQuery);

            analyzeComparisonRule(styleRules, records, response);
            analyzeElseRule(styleRules, ruleFilters, response, bboxFilter);

            return response;
        } catch (BadSqlGrammarException e) {
            throw new DataServiceException("Failed to define actual styles");
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

    private String selectQueryWithBbox(ResourceQualifier tQualifier,
                                       List<RuleFilter> filters,
                                       SpatialRuleFilter bboxFilter) {
        try {
            final SelectQuery selectQuery = new SelectQuery(true);
            selectQuery.addCustomFromTable(tQualifier.getQualifier());
            selectQuery.addCustomColumns("columnsTemplate");

            final ComboCondition orCondition = ComboCondition.or();
            for (RuleFilter filter: filters) {
                orCondition.addCondition(mapToCondition(filter));
            }

            selectQuery.addCondition(
                    ComboCondition.and(orCondition, mapToCondition(bboxFilter))
            );

            final String propNames = String.join(",", getFields(filters));

            return selectQuery.toString()
                              .replace("'columnsTemplate'", propNames);
        } catch (Exception e) {
            throw new QueryBuilderException("Failed to build query. Reason: " + e.getMessage());
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
}
