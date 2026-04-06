package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.config.CrgDataSource;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private final DatasourceFactory datasourceFactory;
    private final IAuthenticationFacade authenticationFacade;

    public DataSourceConfig(DatasourceFactory datasourceFactory,
                            IAuthenticationFacade authenticationFacade) {
        this.datasourceFactory = datasourceFactory;
        this.authenticationFacade = authenticationFacade;
    }

    @Bean
    public DataSource getDataSource() {
        return new CrgDataSource(datasourceFactory.getInitialDataSource(),
                                 authenticationFacade);
    }
}
