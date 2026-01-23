package ru.mycrg.report_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import com.zaxxer.hikari.HikariDataSource;


import javax.validation.constraints.NotNull;

@Service

public class DatasourceFactory {

    private static final Logger log = LoggerFactory.getLogger(DatasourceFactory.class);

    @Autowired
    Environment environment;

    @NotNull
    public HikariDataSource getDataSourceByUrl() {
        String url = environment.getProperty("spring.datasource.url");

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(environment.getRequiredProperty("spring.datasource.username"));
        dataSource.setPassword(environment.getRequiredProperty("spring.datasource.password"));
        dataSource.setMaximumPoolSize(20);

        log.debug("Created new one dataSource by URL: [{}] with pool: [{}]", url, 20);

        return dataSource;
    }
}

