package ru.mycrg.auth_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import ru.mycrg.auth_service.dto.AuthorityProjection;
import ru.mycrg.auth_service.dto.OrganizationProjection;
import ru.mycrg.auth_service.dto.UserProjection;

@Configuration
public class RestConfig extends RepositoryRestConfigurerAdapter {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration repositoryRestConfiguration) {
        repositoryRestConfiguration
                .getProjectionConfiguration()
                .addProjection(OrganizationProjection.class)
                .addProjection(UserProjection.class)
                .addProjection(AuthorityProjection.class);
    }

    @Bean
    public SpelAwareProxyProjectionFactory projectionFactory() {
        return new SpelAwareProxyProjectionFactory();
    }

}
