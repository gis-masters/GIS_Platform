package ru.mycrg.data_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import ru.mycrg.data_service.dao.CrgDataSource;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Autowired
    private Environment environment;

    @Autowired
    private HttpServletRequest request;

    @Bean
    public DataSource getDataSource() {
        final DataSource dataSource = DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(environment.getProperty("spring.datasource.url"))
                .username(environment.getProperty("spring.datasource.username"))
                .password(environment.getProperty("spring.datasource.password"))
                .build();

        return new CrgDataSource(dataSource, request);
    }
}
