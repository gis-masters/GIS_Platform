package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dto.RecordDto;
import ru.mycrg.data_service.dto.styles.*;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.query_builder.QueryBuilder.*;
import static ru.mycrg.data_service.validators.ComparisonRuleValidator.validate;

@Service
public class StylesService {

    private final Logger log = LoggerFactory.getLogger(StylesService.class);

    private final TablesDao tablesDao;

    public StylesService(TablesDao tablesDao) {
        this.tablesDao = tablesDao;
    }

    public List<ActualStylesResponseModel> defineActualStyles(List<ActualStylesRequestModel> request) {
        return request.stream()
                      .map(this::defineActualStyle)
                      .collect(Collectors.toList());
    }

    public ActualStylesResponseModel defineActualStyle(ActualStylesRequestModel requestModel) {
        final ActualStylesResponseModel response = new ActualStylesResponseModel(requestModel);
        final ResourceQualifier tQualifier = new ResourceQualifier(requestModel.getDataset(),
                                                                   requestModel.getIdentifier());

        try {
            final List<StyleRule> styleRules = requestModel.getRules();
            final List<RuleFilter> ruleFilters = styleRules.stream()
                                                           .map(StyleRule::getFilter)
                                                           .collect(Collectors.toList());
            final SpatialRuleFilter bboxFilter = requestModel.getFilter();

            // Правило без фильтра подразумевает выборку без условий
            if (ruleFilters.contains(null) || ruleFilters.isEmpty()) {
                final String sqlQuery = buildSelectOneQueryWithBbox(tQualifier, bboxFilter);
                final List<RecordDto> recordDtos = tablesDao.customListQuery(sqlQuery);
                if (!recordDtos.isEmpty()) {
                    styleRules.stream()
                              .filter(styleRule -> styleRule.getFilter() == null)
                              .findFirst()
                              .ifPresent(styleRule -> response.addRule(styleRule.getName()));
                }
            } else {
                final String sqlQuery = buildSelectQueryWithBbox(tQualifier, ruleFilters, bboxFilter);
                final List<RecordDto> recordDtos = tablesDao.customListQuery(sqlQuery);

                analyzeComparisonRule(styleRules, recordDtos, response);

                styleRules.stream()
                          .filter(styleRule -> styleRule.getFilter() instanceof ElseRuleFilter)
                          .findFirst()
                          .ifPresent(elseRule -> {
                              final String elseQuery = buildSelectNotQueryWithBbox(tQualifier, ruleFilters, bboxFilter);

                              boolean isSomeByElseRuleExist = !tablesDao.customListQuery(elseQuery).isEmpty();
                              if (isSomeByElseRuleExist) {
                                  response.addRule(elseRule.getName());
                              }
                          });
            }
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

        return response;
    }

    private void analyzeComparisonRule(List<StyleRule> rules,
                                       List<RecordDto> recordDtos,
                                       ActualStylesResponseModel response) {
        recordDtos.forEach(record -> {
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
}
