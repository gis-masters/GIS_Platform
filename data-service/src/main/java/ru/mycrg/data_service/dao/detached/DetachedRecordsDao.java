package ru.mycrg.data_service.dao.detached;

import org.hsqldb.types.Types;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.Arrays;
import java.util.Map;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildParameterizedInsertQuery;

@Repository
public class DetachedRecordsDao {

    private static final Logger log = LoggerFactory.getLogger(DetachedRecordsDao.class);

    private final SqlParameterSourceFactory sqlParameterSourceFactory;
    private final DatasourceFactory datasourceFactory;

    public DetachedRecordsDao(SqlParameterSourceFactory sqlParameterSourceFactory,
                              DatasourceFactory datasourceFactory) {
        this.sqlParameterSourceFactory = sqlParameterSourceFactory;
        this.datasourceFactory = datasourceFactory;
    }

    public void addRecordsAsBatch(@NotNull ResourceQualifier qualifier,
                                  @NotNull Map<String, Object>[] body,
                                  @NotNull SchemaDto schema,
                                  @NotNull String databaseName,
                                  @Nullable String datasourceId) throws CrgDaoException {
        try {
            NamedParameterJdbcTemplate jdbcTemplate;
            if (datasourceId == null) {
                jdbcTemplate = new NamedParameterJdbcTemplate(datasourceFactory.getDataSource(databaseName));
            } else {
                jdbcTemplate = new NamedParameterJdbcTemplate(
                        datasourceFactory.getNamedDataSource(databaseName, datasourceId)
                );
            }

            Feature firstFeature = new Feature(body[0]);
            String query = buildParameterizedInsertQuery(qualifier, firstFeature, false);
            MapSqlParameterSource[] parameterSource = Arrays
                    .stream(body)
                    .map(b -> {
                        MapSqlParameterSource source =
                                sqlParameterSourceFactory.buildParameterizedSource(new Feature(b), schema);
                        source.registerSqlType("source_doc", Types.OTHER);

                        return source;
                    })
                    .toArray(MapSqlParameterSource[]::new);

            log.debug("BATCH(size = {}) INSERT QUERY: [{}]", body.length, query);

            jdbcTemplate.batchUpdate(query, parameterSource);
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить вставку(batch) в таблицу: '%s'. %s",
                                       qualifier, e.getCause().getMessage());
            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при вставке в таблицу: '%s'. %s",
                                       qualifier, e.getCause().getMessage());
            throw new CrgDaoException(msg);
        }
    }

    public void truncateTable(@NotNull String databaseName,
                              @NotNull ResourceQualifier qualifier) throws CrgDaoException {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

            String query = String.format("TRUNCATE %s.%s", qualifier.getSchema(), qualifier.getTable());
            log.debug("Очистка таблицы: [{}]", query);

            jdbcTemplate.execute(query);
        } catch (Exception e) {
            throw new CrgDaoException("Ошибка очистки таблицы " + qualifier, e);
        }
    }
}
