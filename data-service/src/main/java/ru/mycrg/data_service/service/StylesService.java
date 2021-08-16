package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.query_builder.QueryBuilder;
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.dto.styles.*;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StylesService {

    public static final Logger log = LoggerFactory.getLogger(StylesService.class);

    private final TablesDao tablesDao;
    private final QueryBuilder queryBuilder;

    public StylesService(TablesDao tablesDao,
                         QueryBuilder queryBuilder) {
        this.tablesDao = tablesDao;
        this.queryBuilder = queryBuilder;
    }

    public List<ActualStylesResponseModel> defineActualStyles(List<ActualStylesRequestModel> request) {
        return request.stream()
                      .map(this::defineActualStyle)
                      .collect(Collectors.toList());
    }

    public ActualStylesResponseModel defineActualStyle(ActualStylesRequestModel requestModel) {
        try {
            final ResourceQualifier tQualifier = new ResourceQualifier(requestModel.getDataset(),
                                                                       requestModel.getIdentifier());
            final List<RuleFilter> rules = requestModel.getRules().stream()
                                                       .map(StyleRule::getFilter)
                                                       .collect(Collectors.toList());

            final SpatialRuleFilter bboxFilter = requestModel.getFilter();

            String sqlQuery = queryBuilder.selectQuery(tQualifier, rules, bboxFilter);

            final List<Record> data = tablesDao.customQuery(sqlQuery);

            return analyzeData(requestModel, data);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Failed to define actual styles. Reason: {}", e.getMessage());

            return new ActualStylesResponseModel();
        }
    }

    private ActualStylesResponseModel analyzeData(ActualStylesRequestModel requestModel,
                                                  List<Record> data) {
        final ActualStylesResponseModel responseModel = new ActualStylesResponseModel(requestModel);

        data.forEach(record -> {
            final Map<String, Object> recordContent = record.getContent();

            requestModel.getRules()
                        .forEach(styleRule -> {
                            final ComparisonRuleFilter filter = (ComparisonRuleFilter) styleRule.getFilter();
                            final String propertyName = filter.getPropertyName();

                            if (recordContent.containsKey(propertyName)) {
                                final String value = (String) recordContent.get(propertyName);

                                if (value.equals(filter.getLiteral())) {
                                    responseModel.addRule(styleRule.getName());
                                }
                            }
                        });
        });

        return responseModel;
    }
}
