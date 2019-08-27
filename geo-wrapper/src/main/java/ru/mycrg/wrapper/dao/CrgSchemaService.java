package ru.mycrg.wrapper.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.MessageFormat;

@Service
public class CrgSchemaService extends BaseDaoService implements ICrgSchema {

    private static final Logger log = LoggerFactory.getLogger(CrgSchemaService.class);

    public CrgSchemaService(DatasourceFactory datasourceFactory, ResourceLoader resourceLoader) {
        super(datasourceFactory, resourceLoader);
    }

    /**
     * Создание схемы
     */
    public void create(String dbName, String schemaName) {
        log.debug("Создание схемы {} Для БД: {}", schemaName, dbName);

        datasourceFactory
                .getJdbcTemplate(dbName)
                .execute("CREATE SCHEMA " + schemaName + "; ALTER SCHEMA " + schemaName + " OWNER TO fiz;");
    }

}
