package ru.mycrg.data_service.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.data_service.dao.CrgDataSource;
import ru.mycrg.data_service.dao.CrgDataSourcesPool;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private CrgDataSourcesPool crgDataSourcesPool;

    @Bean
    public DataSource getDataSource() {
        HikariDataSource initialDataSource = crgDataSourcesPool.getInitialDataSource();

        return new CrgDataSource(initialDataSource, request);
    }
}
