package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;

@Transactional
@Repository
public class ParameterizedBaseDao {

    private final Logger log = LoggerFactory.getLogger(ParameterizedBaseDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public ParameterizedBaseDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public Long save(@NotNull String query,
                     @NotNull MapSqlParameterSource parameterSource) throws CrgDaoException {
        try {
            log.debug("INSERT QUERY: [{}]", query);

            return pJdbcTemplate.queryForObject(query, parameterSource, Long.class);
        } catch (Exception e) {
            throw new CrgDaoException(e.getMessage());
        }
    }

    public void updateById(@NotNull String query,
                           @NotNull MapSqlParameterSource parameterSource) throws CrgDaoException {
        try {
            log.debug("UPDATE by id QUERY: [{}]", query);

            pJdbcTemplate.update(query, parameterSource);
        } catch (Exception e) {
            throw new CrgDaoException(e.getMessage());
        }
    }
}
