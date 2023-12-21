package ru.mycrg.data_service.dao.detached;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.SchemaDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

/**
 * Класс является оберткой над {@link ru.mycrg.data_service.dao.SchemaDao} для оторванных от контекста вызовов
 */
@Component
public class DetachedSchemaDao {

    private final DatasourceFactory datasourceFactory;

    public DetachedSchemaDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public SchemaDao schemaDao(@NotNull String databaseName) {
        var jdbcTemplate = new NamedParameterJdbcTemplate(datasourceFactory.getDataSource(databaseName));
        return new SchemaDao(new BaseDao(jdbcTemplate));
    }
}
