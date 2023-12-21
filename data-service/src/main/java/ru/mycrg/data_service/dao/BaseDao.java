package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;
import ru.mycrg.data_service.entity.IContent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceJsonCondition;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.ResourceQualifierUtil.getIdField;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildOrderBySection;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildParameterizedInsertQuery;

@Transactional
@Repository
public class BaseDao {

    private static final Logger log = LoggerFactory.getLogger(BaseDao.class);

    static {
        System.setProperty("com.healthmarketscience.sqlbuilder.useBooleanLiterals", "true");
    }

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public BaseDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public <T> Optional<T> findByFilter(ResourceQualifier tQualifier, String ecqlFilter, Class<T> clazz) {
        try {
            String query = String.format("SELECT * FROM %s %s",
                                         tQualifier.getTableQualifier(), buildWhereSection(ecqlFilter));
            log.debug("Find by filter: [{}]", query);

            T obj = pJdbcTemplate.getJdbcTemplate()
                                 .queryForObject(query, new BeanPropertyRowMapper<>(clazz));

            return Optional.ofNullable(obj);
        } catch (DataAccessException e) {
            log.error("Failed to find object: Reason: {}", e.getMessage(), e.getCause());

            return Optional.empty();
        }
    }

    public Optional<IRecord> findBy(ResourceQualifier qualifier,
                                    String ecqlFilter,
                                    @Nullable SchemaDto schema) {
        String query = String.format("SELECT * FROM %s %s",
                                     qualifier.getTableQualifier(), buildWhereSection(ecqlFilter));
        log.debug("Find by schema and by filter: [{}]", query);

        List<IRecord> records = pJdbcTemplate.getJdbcTemplate()
                                             .query(query, new RecordRowMapper(schema));

        return records.isEmpty()
                ? Optional.empty()
                : Optional.of(records.get(0));
    }

    public Optional<IRecord> findBy(ResourceQualifier qualifier,
                                    String ecqlFilter) {
        return findBy(qualifier, ecqlFilter, null);
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

    /**
     * Пример запроса:
     *
     * @code SELECT * FROM workspace_789.landplot_1627_2d2b WHERE jsonb_path_exists(file::jsonb, '$[*] ? (@.id ==
     * $idvalue )', '{"idvalue":26410}');
     */
    public Optional<IRecord> findByJson(ResourceJsonCondition qualifier, @Nullable SchemaDto schema) {
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

    public Optional<IRecord> findById(ResourceQualifier qualifier) {
        return findById(qualifier, null);
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

    public <T> List<T> findAll(ResourceQualifier qualifier,
                               String ecqlFilter,
                               RowMapper<T> rowMapper) {
        String query = "SELECT * FROM " + qualifier.getTableQualifier() +
                " " + buildWhereSection(ecqlFilter);

        log.debug("Query find all with filter: [{}]", query);

        return pJdbcTemplate.query(query, rowMapper);
    }

    public Long getTotal(ResourceQualifier qualifier, String ecqlFilter) {
        String query = String.format("SELECT count(*) FROM %s %s",
                                     qualifier.getTableQualifier(), buildWhereSection(ecqlFilter));

        log.debug("Request find total by path: [{}]", query);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);
    }

    /**
     * Для удаления записи по параметру и его значению.
     * <p>
     * Значение будет встроено в IN условие, соответственно можно передавать несколько значений через запятую
     *
     * @param rQualifier Квалификатор ресурса
     * @param param      Поле, по которому производится удаление записи
     * @param value      Значение, при котором запись удаляется
     *
     * @throws CrgDaoException Когда не удалось выполнить удаление
     */
    public void removeRecord(ResourceQualifier rQualifier, String param, Object value) throws CrgDaoException {
        try {
            String query = String.format("DELETE FROM %s WHERE %s IN (%s)",
                                         rQualifier.getTableQualifier(), param, value);

            log.debug("Request to delete record: [{}]", query);

            pJdbcTemplate.getJdbcTemplate().execute(query);
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить удаление объекта(ов): '%s' из: '%s'",
                                       value, rQualifier.getTableQualifier());
            log.debug(msg);

            throw new CrgDaoException(msg, e.getCause());
        }
    }

    public void removeAllRecords(ResourceQualifier rQualifier) {
        try {
            String query = String.format("DELETE FROM %s",
                                         rQualifier.getTableQualifier());

            log.debug("Request to delete all records: [{}]", query);

            pJdbcTemplate.getJdbcTemplate().execute(query);
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить удаление объектов из: '%s'",
                                       rQualifier.getTableQualifier());
            log.debug(msg);

            throw new DataServiceException(msg, e.getCause());
        }
    }
}
