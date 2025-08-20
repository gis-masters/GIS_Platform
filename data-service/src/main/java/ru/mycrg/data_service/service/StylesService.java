package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.styles.*;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.utils.query_builder.QueryBuilder.*;
import static ru.mycrg.data_service.validators.ComparisonRuleValidator.validate;

@Service
public class StylesService {

    private final Logger log = LoggerFactory.getLogger(StylesService.class);

    private final RecordsDao recordsDao;
    private final TableService tableService;

    public StylesService(RecordsDao recordsDao,
                         TableService tableService) {
        this.recordsDao = recordsDao;
        this.tableService = tableService;
    }

    public List<ActualStylesResponseModel> defineActualStyles(List<ActualStylesRequestModel> request) {
        return request.stream()
                      .map(this::defineActualStyle)
                      .collect(Collectors.toList());
    }

    public ActualStylesResponseModel defineActualStyle(ActualStylesRequestModel requestModel) {
        ActualStylesResponseModel response = new ActualStylesResponseModel(requestModel);
        String ecqlFilter = requestModel.getEcqlFilter();
        String tableName = requestModel.getIdentifier();
        ResourceQualifier tQualifier = new ResourceQualifier(requestModel.getDataset(), tableName);

        try {
            SchemaDto schema = tableService.getInfo(tQualifier).getSchema();
            if (schema == null) {
                throw new NotFoundException("Не удалось найти схему: " + tQualifier.getQualifier());
            }

            List<StyleRule> styleRules = requestModel.getRules();
            List<RuleFilter> ruleFilters = styleRules.stream()
                                                     .map(StyleRule::getFilter)
                                                     .collect(Collectors.toList());
            SpatialRuleFilter bboxFilter = requestModel.getFilter();

            // Правило без фильтра подразумевает выборку без условий
            if (ruleFilters.contains(null) || ruleFilters.isEmpty()) {
                String sqlQuery = buildSelectOneQueryWithBbox(tQualifier, bboxFilter, ecqlFilter);
                List<IRecord> recordDtos = recordsDao.customListQuery(sqlQuery, schema);
                if (!recordDtos.isEmpty()) {
                    styleRules.stream()
                              .filter(styleRule -> styleRule.getFilter() == null)
                              .findFirst()
                              .ifPresent(styleRule -> response.addRule(styleRule.getName()));
                }
            } else {
                String sqlQuery = buildSelectQueryWithBbox(tQualifier, ruleFilters, bboxFilter, ecqlFilter);
                List<IRecord> recordDtos = recordsDao.customListQuery(sqlQuery, schema);

                analyzeComparisonRule(styleRules, recordDtos, response);

                styleRules.stream()
                          .filter(styleRule -> styleRule.getFilter() instanceof ElseRuleFilter)
                          .findFirst()
                          .ifPresent(elseRule -> {
                              String elseQuery =
                                      buildSelectNotQueryWithBbox(tQualifier, ruleFilters, bboxFilter, ecqlFilter);

                              boolean isSomeByElseRuleExist = !recordsDao.customListQuery(elseQuery, schema).isEmpty();
                              if (isSomeByElseRuleExist) {
                                  response.addRule(elseRule.getName());
                              }
                          });
            }
        } catch (BadSqlGrammarException e) {
            String msg = "Failed to define actual styles";
            Throwable cause = e.getCause();
            if (cause != null) {
                throw new DataServiceException(msg, new ErrorInfo("sqlQuery", cause.getMessage()));
            }

            throw new DataServiceException(msg);
        } catch (Exception e) {
            String msg = "Failed to define actual styles. Reason: " + e.getMessage();
            log.error(msg, e.getCause());

            throw new DataServiceException(msg);
        }

        return response;
    }

    private void analyzeComparisonRule(List<StyleRule> rules,
                                       List<IRecord> recordDtos,
                                       ActualStylesResponseModel response) {
        recordDtos.forEach(record -> {
            Map<String, Object> recordContent = record.getContent();

            rules.stream()
                 .filter(styleRule -> styleRule.getFilter() instanceof ComparisonRuleFilter)
                 .forEach(styleRule -> {
                     ComparisonRuleFilter filter = (ComparisonRuleFilter) styleRule.getFilter();
                     String propertyName = filter.getPropertyName();
                     if (recordContent.containsKey(propertyName)) {
                         String recordValue = (String) recordContent.get(propertyName);
                         if (validate(filter, recordValue)) {
                             response.addRule(styleRule.getName());
                         }
                     }
                 });
        });
    }
}
