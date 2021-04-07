package ru.mycrg.data_service.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.data_service.dao.CrgDataSource;
import ru.mycrg.data_service.dao.CrgDataSourcesPool;
import ru.mycrg.data_service.security.IAuthenticationFacade;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private final HttpServletRequest request;
    private final CrgDataSourcesPool crgDataSourcesPool;
    private final IAuthenticationFacade authenticationFacade;

    public DataSourceConfig(HttpServletRequest request,
                            CrgDataSourcesPool crgDataSourcesPool,
                            IAuthenticationFacade authenticationFacade) {
        this.request = request;
        this.crgDataSourcesPool = crgDataSourcesPool;
        this.authenticationFacade = authenticationFacade;
    }

    @Bean
    public DataSource getDataSource() {
        HikariDataSource initialDataSource = crgDataSourcesPool.getInitialDataSource();

        return new CrgDataSource(initialDataSource, request, authenticationFacade);
    }
}
