package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;

import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.ErrorDetailsExtractor.extractDetails;
import static ru.mycrg.data_service.util.StringUtil.buildQueryWithParams;

@Transactional
@Repository
public class BaseWriteDao {

    private final Logger log = LoggerFactory.getLogger(BaseWriteDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public BaseWriteDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public KeyHolder save(@NotNull String query,
                          @NotNull MapSqlParameterSource parameterSource) throws CrgDaoException {
        try {
            log.debug("Execute parameterized save query: [{}]",
                      buildQueryWithParams(query, parameterSource.getValues()));

            KeyHolder keyHolder = new GeneratedKeyHolder();
            pJdbcTemplate.update(query, parameterSource, keyHolder);

            return keyHolder;
        } catch (Exception e) {
            String msg = "Не удалось выполнить сохранение => " + e.getMessage();

            throw new CrgDaoException(msg, extractDetails(e));
        }
    }

    public void update(@NotNull String query,
                       @NotNull MapSqlParameterSource parameterSource) throws CrgDaoException {
        try {
            log.debug("Execute parameterized update query: [{}]",
                      buildQueryWithParams(query, parameterSource.getValues()));

            pJdbcTemplate.update(query, parameterSource);
        } catch (Exception e) {
            String msg = "Не удалось выполнить обновление => " + e.getMessage();
            logError(msg, e);

            throw new CrgDaoException(msg, extractDetails(e));
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
