package ru.mycrg.data_service.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.config.CrgDataSource;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private final HttpServletRequest request;
    private final DatasourceFactory datasourceFactory;
    private final IAuthenticationFacade authenticationFacade;

    public DataSourceConfig(HttpServletRequest request,
                            DatasourceFactory datasourceFactory,
                            IAuthenticationFacade authenticationFacade) {
        this.request = request;
        this.datasourceFactory = datasourceFactory;
        this.authenticationFacade = authenticationFacade;
    }

    @Bean
    public DataSource getDataSource() {
        HikariDataSource initialDataSource = datasourceFactory.getInitialDataSource();

        return new CrgDataSource(initialDataSource, request, authenticationFacade);
    }
}
