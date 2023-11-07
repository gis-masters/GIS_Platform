package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dto.FtsItem;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;

import static java.sql.Types.VARCHAR;
import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;

@Repository
public class FtsDao {

    private final Logger log = LoggerFactory.getLogger(FtsDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public FtsDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public List<FtsItem> search(ResourceQualifier qualifier,
                                List<ResourceQualifier> libraries,
                                String ecqlFilter,
                                String text,
                                float bound,
                                Pageable pageable) {
        String query = "" +
                "SELECT " +
                "  d.concatenated_data OPERATOR (public.<->) :searchedText as dist," +
                "  d.schema," +
                "  d.table," +
                "  d.id " +
                "FROM " + qualifier.getTableQualifier() + " AS d " +
                " " + buildWhere(ecqlFilter, bound) + " " +
                "ORDER BY dist OFFSET " + pageable.getOffset() + " LIMIT " + pageable.getPageSize();

        log.debug("fts by documents: [{}]", query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        return pJdbcTemplate.query(query, parameters, new BeanPropertyRowMapper<>(FtsItem.class));
    }

    public Long countTotal(ResourceQualifier qualifier,
                           List<ResourceQualifier> libraries,
                           String ecqlFilter,
                           String text,
                           float bound) {
        String query = "SELECT count(*) FROM " + qualifier.getTableQualifier() + " AS d " +
                " " + buildWhere(ecqlFilter, bound);

        log.debug("fts count total for documents: [{}]", query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        return pJdbcTemplate.queryForObject(query, parameters, Long.class);
    }

    private String buildWhere(String ecqlFilter, float bound) {
        String filter = buildWhereSection(ecqlFilter);
        if (filter.isBlank()) {
            return String.format("WHERE (d.concatenated_data OPERATOR (public.<->) :searchedText < %s)",
                                 bound);
        } else {
            return String.format("%s AND (d.concatenated_data OPERATOR (public.<->) :searchedText < %s)",
                                 buildWhereSection(ecqlFilter), bound);
        }
    }
}
