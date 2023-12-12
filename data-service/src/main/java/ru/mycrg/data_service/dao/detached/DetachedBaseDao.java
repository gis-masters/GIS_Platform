package ru.mycrg.data_service.dao.detached;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;

/**
 * Класс является оберткой над {@link ru.mycrg.data_service.dao.BaseDao} для оторванных от контекста вызовов
 */
@Component
public class DetachedBaseDao {

    private final SqlParameterSourceFactory sqlParameterSourceFactory;
    private final DatasourceFactory datasourceFactory;

    public DetachedBaseDao(SqlParameterSourceFactory sqlParameterSourceFactory, DatasourceFactory datasourceFactory) {
        this.sqlParameterSourceFactory = sqlParameterSourceFactory;
        this.datasourceFactory = datasourceFactory;
    }

    public BaseDao baseData(@NotNull String databaseName) {
        var jdbcTemplate = new NamedParameterJdbcTemplate(datasourceFactory.getDataSource(databaseName));
        return new BaseDao(sqlParameterSourceFactory, jdbcTemplate);
    }
}
