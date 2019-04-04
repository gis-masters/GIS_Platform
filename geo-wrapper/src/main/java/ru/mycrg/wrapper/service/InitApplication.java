package ru.mycrg.wrapper.service;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.UrlResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptException;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.sql.SQLException;

@Component
public class InitApplication {

    private static Logger log = LoggerFactory.getLogger(InitApplication.class);

    private final DatasourceFactory datasourceFactory;

    public InitApplication(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void contextRefreshedEvent() {
        log.debug("Инициализация шаблонной БД");

        try {
            HikariDataSource datasource = datasourceFactory.getDatasource("gis");

            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);
            String checkSchemaSql = "SELECT count(*) FROM pg_namespace WHERE nspname = 'fiz'";
            int result = jdbcTemplate.queryForObject(checkSchemaSql, Integer.class);

            if (result > 0) {
                log.info("Схема существует, инициализация не требуется");
            } else {
                File schemaFile = ResourceUtils.getFile("classpath:db/p10Template.sql");
                File dataFile = ResourceUtils.getFile("classpath:db/data.sql");

                // Create schema
                ScriptUtils.executeSqlScript(datasource.getConnection(), new UrlResource(schemaFile.toURI()));

                // Insert data
                ScriptUtils.executeSqlScript(datasource.getConnection(), new UrlResource(dataFile.toURI()));
            }
        } catch (SQLException e) {
            log.error("Неудалось подключится к БД: gis / {}", e.getLocalizedMessage());
        } catch (MalformedURLException | FileNotFoundException e) {
            log.error("Неудалось открыть файл с шаблоном БД по 10 приказу. {}", e.getLocalizedMessage());
        } catch (ScriptException e) {
            log.error("Ошибка при выполнении скрипта: {}", e.getLocalizedMessage());
        }
    }
}
