package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.resources.ResourceJsonCondition;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.ResourceQualifierUtil.getIdField;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildOrderBySection;

@Transactional
@Repository
public class BaseReadDao {

    private static final Logger log = LoggerFactory.getLogger(BaseReadDao.class);

    static {
        System.setProperty("com.healthmarketscience.sqlbuilder.useBooleanLiterals", "true");
    }

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public BaseReadDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public Optional<IRecord> findBy(ResourceQualifier qualifier,
                                    String ecqlFilter) {
        String query = String.format("SELECT * FROM %s %s",
                                     qualifier.getTableQualifier(), buildWhereSection(ecqlFilter));

        log.debug("Find one by filter: [{}]", query);
        List<IRecord> records = pJdbcTemplate.getJdbcTemplate()
                                             .query(query, new RecordRowMapper(null));

        return records.isEmpty()
                ? Optional.empty()
                : Optional.of(records.get(0));
    }

    public IRecord getById(ResourceQualifier qualifier,
                           @Nullable SchemaDto schema) throws CrgDaoException {
        return findById(qualifier, schema)
                .orElseThrow(
                        () -> CrgDaoException.recordNotFound(qualifier.getTableQualifier(), qualifier.getRecordId()));
    }

    public Optional<IRecord> findById(ResourceQualifier qualifier) {
        return findById(qualifier, null);
    }

    public Optional<IRecord> findById(ResourceQualifier qualifier,
                                      @Nullable SchemaDto schema) {
        String fieldId = getIdField(qualifier);
        String query = String.format("SELECT * FROM %s WHERE %s = :%s",
                                     qualifier.getTableQualifier(), fieldId, fieldId);

        log.debug("find record by id: [{}]", query);

        return pJdbcTemplate.query(query,
                                   new MapSqlParameterSource(fieldId, qualifier.getRecordId()),
                                   new RecordRowMapper(schema))
                            .stream()
                            .findFirst();
    }

    public <T> List<T> findAll(ResourceQualifier qualifier,
                               String ecqlFilter,
                               Pageable pageable,
                               Class<T> clazz) {
        return findAll(qualifier, ecqlFilter, pageable, new BeanPropertyRowMapper<>(clazz));
    }

    public <T> List<T> findAll(ResourceQualifier qualifier,
                               String ecqlFilter,
                               Pageable pageable,
                               RowMapper<T> rowMapper) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        String query = "SELECT * FROM " + qualifier.getTableQualifier() +
                "  " + buildWhereSection(ecqlFilter) +
                "  " + buildOrderBySection(pageable.getSort()) +
                "  LIMIT :limit OFFSET :offset";

        log.debug("Request find all with filter and pageable and class: [{}]", query);

        return pJdbcTemplate.query(query, params, rowMapper);
    }

    public <T> List<T> findAll(ResourceQualifier qualifier,
                               String ecqlFilter,
                               Class<T> clazz) {
        return findAll(qualifier, ecqlFilter, new BeanPropertyRowMapper<>(clazz));
    }

    public Long total(ResourceQualifier qualifier, String ecqlFilter) {
        String query = String.format("SELECT count(*) FROM %s %s",
                                     qualifier.getTableQualifier(), buildWhereSection(ecqlFilter));

        log.debug("Request find total by path: [{}]", query);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);
    }

    public IRecord getByJson(ResourceJsonCondition qualifier,
                             @Nullable SchemaDto schema) throws CrgDaoException {
        return findByJson(qualifier, schema)
                .orElseThrow(() -> CrgDaoException.recordNotFound(qualifier.getTableQualifier(),
                                                                  qualifier.getJsonIdValue()));
    }

    /**
     * Пример запроса:
     *
     * @code SELECT * FROM workspace_789.landplot_1627_2d2b WHERE jsonb_path_exists(file::jsonb, '$[*] ? (@.id ==
     * $idvalue )', '{"idvalue":26410}');
     */
    public Optional<IRecord> findByJson(ResourceJsonCondition qualifier,
                                        @Nullable SchemaDto schema) {
        var query = String.format(
                "SELECT * FROM %s WHERE jsonb_path_exists(%s::jsonb, '$[*] ? (@.id == $idvalue )', '{\"idvalue\":%s}');",
                qualifier.getTableQualifier(),
                qualifier.getJsonFieldName(),
                qualifier.getJsonIdValue()
        );

        log.debug("find record by json query: [{}]", query);

        var records = pJdbcTemplate.getJdbcTemplate()
                                   .query(query, new RecordRowMapper(schema));

        return records.isEmpty()
                ? Optional.empty()
                : Optional.of(records.get(0));
    }

    private <T> List<T> findAll(ResourceQualifier qualifier,
                                String ecqlFilter,
                                RowMapper<T> rowMapper) {
        String query = "SELECT * FROM " + qualifier.getTableQualifier() +
                " " + buildWhereSection(ecqlFilter);

        log.debug("Query find all with filter: [{}]", query);

        return pJdbcTemplate.query(query, rowMapper);
    }
}
