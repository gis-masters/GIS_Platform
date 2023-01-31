package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;

import java.util.List;

import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.ErrorDetailsExtractor.extractDetails;

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
            String msg = "Не удалось выполнить сохранение";
            logError(msg, e);

            throw new CrgDaoException(msg, extractDetails(e));
        }
    }

    public void update(@NotNull String query,
                       @NotNull MapSqlParameterSource parameterSource) throws CrgDaoException {
        try {
            log.debug("UPDATE QUERY: [{}]", query);

            pJdbcTemplate.update(query, parameterSource);
        } catch (Exception e) {
            String msg = "Не удалось выполнить обновление";
            logError(msg, e);

            throw new CrgDaoException(msg, extractDetails(e));
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

    public void batchUpdate(@NotNull String query,
                            @NotNull List<MapSqlParameterSource> parameterSource) throws CrgDaoException {
        try {
            log.debug("batchUpdate QUERY: [{}]", query);

            pJdbcTemplate.batchUpdate(query, parameterSource.toArray(SqlParameterSource[]::new));
        } catch (Exception e) {
            throw new CrgDaoException(e.getMessage());
        }
    }
}
