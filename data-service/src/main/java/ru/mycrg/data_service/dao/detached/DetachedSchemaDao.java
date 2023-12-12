package ru.mycrg.data_service.dao.detached;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.SchemaDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;

/**
 * Класс является оберткой над {@link ru.mycrg.data_service.dao.SchemaDao} для оторванных от контекста вызовов
 */
@Component
public class DetachedSchemaDao {

    private final SqlParameterSourceFactory sqlParameterSourceFactory;
    private final DatasourceFactory datasourceFactory;

    public DetachedSchemaDao(SqlParameterSourceFactory sqlParameterSourceFactory, DatasourceFactory datasourceFactory) {
        this.sqlParameterSourceFactory = sqlParameterSourceFactory;
        this.datasourceFactory = datasourceFactory;
    }

    public SchemaDao schemaDao(@NotNull String databaseName) {
        var jdbcTemplate = new NamedParameterJdbcTemplate(datasourceFactory.getDataSource(databaseName));
        return new SchemaDao(new BaseDao(sqlParameterSourceFactory, jdbcTemplate));
    }
}
