package ru.mycrg.data_service.dao.detached;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

/**
 * Класс является оберткой над {@link ru.mycrg.data_service.dao.BaseDao} для оторванных от контекста вызовов
 */
@Component
public class DetachedBaseDao {
    private final DatasourceFactory datasourceFactory;

    public DetachedBaseDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public BaseDao baseData(@NotNull String databaseName) {
        var jdbcTemplate = new NamedParameterJdbcTemplate(datasourceFactory.getDataSource(databaseName));
        return new BaseDao(jdbcTemplate);
    }
}
