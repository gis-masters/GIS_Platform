package ru.mycrg.auth_service.util;

import org.geotools.data.jdbc.FilterToSQL;
import org.geotools.data.jdbc.FilterToSQLException;
import org.geotools.data.postgis.PostGISDialect;
import org.geotools.data.postgis.PostgisFilterToSQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.opengis.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.auth_service.exceptions.BadRequestException;

public class EcqlHandler {

    private static final Logger log = LoggerFactory.getLogger(EcqlHandler.class);

    private EcqlHandler() {
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
}
