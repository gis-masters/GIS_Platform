package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class SqlBuilder {

    private static final Logger log = LoggerFactory.getLogger(SqlBuilder.class);

    public static String fillWhereSectionByFilter(CrgFilter filter) {
        StringBuilder result = new StringBuilder();
        for (FilterItem filterItem: filter.getFilters()) {
            final String name = filterItem.getField();
            final String value = filterItem.getValue();
            final FilterCondition condition = filterItem.getCondition();

            if (condition.equals(FilterCondition.EQUAL_TO)) {
                if (!value.isEmpty()) {
                    result.append(" AND ")
                          .append(name)
                          .append(" = '")
                          .append(value)
                          .append("' ");
                }
            } else if (condition.equals(FilterCondition.IS_NULL)) {
                result.append(" AND ")
                      .append(name)
                      .append(" is null ");
            } else if (condition.equals(FilterCondition.LIKE)) {
                if (!value.isEmpty()) {
                    result.append(" AND lower(")
                          .append(name)
                          .append(") LIKE lower('%")
                          .append(value)
                          .append("%') ");
                }
            } else {
                log.warn("Unsupported FilterCondition: {}", condition);
            }
        }

        return result.toString();
    }

    public static String buildInSection(Collection<String> ids) {
        final List<String> asString = ids.stream()
                                         .map(s -> "'" + s + "'")
                                         .collect(Collectors.toList());

        return String.join(",", asString);
    }

    @NotNull
    public static String buildOrderBySection(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }

        final List<String> orderItems = sort.stream()
                                            .map(order -> order.getProperty() + " " + order.getDirection())
                                            .collect(Collectors.toList());

        return " ORDER BY " + String.join(",", orderItems) + " ";
    }
}
