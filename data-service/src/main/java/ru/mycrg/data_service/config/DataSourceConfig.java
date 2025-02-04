package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.config.CrgDataSource;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private final HttpServletRequest httpServletRequest;
    private final DatasourceFactory datasourceFactory;
    private final IAuthenticationFacade authenticationFacade;

    public DataSourceConfig(HttpServletRequest httpServletRequest,
                            DatasourceFactory datasourceFactory,
                            IAuthenticationFacade authenticationFacade) {
        this.httpServletRequest = httpServletRequest;
        this.datasourceFactory = datasourceFactory;
        this.authenticationFacade = authenticationFacade;
    }

    @Bean
    public DataSource getDataSource() {
        return new CrgDataSource(datasourceFactory.getInitialDataSource(),
                                 httpServletRequest,
                                 authenticationFacade);
    }
}
