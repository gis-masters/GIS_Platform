package ru.mycrg.data_service.config;

import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import ru.mycrg.data_service.dao.CrgDataSource;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

@Log
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
                .url("jdbc:postgresql://127.0.0.1:5434/crg_data_service")
                .username("fiz")
                .password("314")
                .build();

        return new CrgDataSource(dataSource, environment, request);
    }
}
