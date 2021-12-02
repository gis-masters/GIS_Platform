package ru.mycrg.data_service.dao.utils;

import org.geotools.data.jdbc.FilterToSQL;
import org.geotools.data.jdbc.FilterToSQLException;
import org.geotools.data.postgis.PostGISDialect;
import org.geotools.data.postgis.PostgisFilterToSQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.jetbrains.annotations.NotNull;
import org.opengis.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class SqlBuilder {

    private static final Logger log = LoggerFactory.getLogger(SqlBuilder.class);

    private SqlBuilder() {
        throw new IllegalStateException("Utility class");
    }

    public static String buildWhereSection(String ecqlFilter) {
        try {
            if (ecqlFilter == null || ecqlFilter.isBlank()) {
                return "";
            }

            Filter filter = ECQL.toFilter(ecqlFilter);
            FilterToSQL encoder = new PostgisFilterToSQL(new PostGISDialect(null));
            // encoder.setInline(true); // don't adding WHERE

            return encoder.encodeToString(filter);
        } catch (CQLException | FilterToSQLException e) {
            String msg = String.format("Задан некорректный ECQL фильтр: [%s]", ecqlFilter);
            log.error("{} Reason: [{}]", msg, e.getMessage());

            throw new BadRequestException(msg);
        }
    }

    public static String fillWhereSectionByFilter(CrgFilter filter) {
        StringBuilder result = new StringBuilder();
        for (FilterItem filterItem: filter.getFilters()) {
            String name = filterItem.getField();
            String value = filterItem.getValue();
            FilterCondition condition = filterItem.getCondition();

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
        List<String> asString = ids.stream()
                                   .map(s -> "'" + s + "'")
                                   .collect(Collectors.toList());

        return String.join(",", asString);
    }

    @NotNull
    public static String buildOrderBySection(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }

        List<String> orderItems = sort.stream()
                                      .map(order -> getProperty(order.getProperty()) + " " + order.getDirection())
                                      .collect(Collectors.toList());

        return " ORDER BY " + String.join(",", orderItems) + " ";
    }

    private static String getProperty(String property) {
        if (property.equalsIgnoreCase("createdAt")) {
            return "created_at";
        }

        return property;
    }
}
