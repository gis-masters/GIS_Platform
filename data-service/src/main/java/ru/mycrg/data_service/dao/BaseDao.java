package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildOrderBySection;

@Transactional
@Repository
public class BaseDao {

    private final Logger log = LoggerFactory.getLogger(BaseDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public BaseDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        System.setProperty("com.healthmarketscience.sqlbuilder.useBooleanLiterals", "true");
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public <T> Optional<T> findByFilter(ResourceQualifier tQualifier, String ecqlFilter, Class<T> clazz) {
        try {
            String query = String.format("SELECT * FROM %s %s",
                                         tQualifier.getTableQualifier(),
                                         buildWhereSection(ecqlFilter));
            log.debug("Find by filter: [{}]", query);

            T obj = pJdbcTemplate.getJdbcTemplate()
                                 .queryForObject(query, new BeanPropertyRowMapper<>(clazz));

            return Optional.ofNullable(obj);
        } catch (DataAccessException e) {
            log.error("Failed to find object: Reason: {}", e.getMessage(), e.getCause());

            return Optional.empty();
        }
    }

    public <T> List<T> findAll(ResourceQualifier tableQualifier,
                               String ecqlFilter,
                               Pageable pageable,
                               Class<T> clazz) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        String query = "SELECT * FROM " + tableQualifier +
                "  " + buildWhereSection(ecqlFilter) +
                "  " + buildOrderBySection(pageable.getSort()) +
                "  LIMIT :limit OFFSET :offset";

        log.debug("Request find all with filter and pageable and class: [{}]", query);

        return pJdbcTemplate.query(query, params, new BeanPropertyRowMapper<>(clazz));
    }

    public Long getTotal(ResourceQualifier tableQualifier, String ecqlFilter) {
        String query = String.format("SELECT count(*) FROM %s %s", tableQualifier, buildWhereSection(ecqlFilter));

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
}
