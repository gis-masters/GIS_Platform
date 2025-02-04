package ru.mycrg.data_service.util;

import org.geotools.filter.text.ecql.ECQL;
import org.opengis.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

public class EcqlParser {

    private static final Logger log = LoggerFactory.getLogger(EcqlParser.class);

    private EcqlParser() {
        throw new IllegalStateException("Utility class");
    }

    public static Optional<Filter> parse(String ecqlFilter) {
        try {
            return Optional.ofNullable(ECQL.toFilter(ecqlFilter));
        } catch (Exception e) {
            log.warn("Задан некорректный ECQL фильтр: [{}]", ecqlFilter);

            return Optional.empty();
        }
    }
}
