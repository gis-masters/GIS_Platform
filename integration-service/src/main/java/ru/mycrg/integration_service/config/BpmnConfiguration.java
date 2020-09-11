package ru.mycrg.integration_service.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import ru.mycrg.integration_service.bpmn.org_deletion.CheckResultDelegate;
import ru.mycrg.integration_service.bpmn.org_deletion.ClearGeoserverDelegate;
import ru.mycrg.integration_service.bpmn.org_deletion.DeleteDbDelegate;
import ru.mycrg.integration_service.bpmn.org_deletion.SendEventDelegate;

@Configuration
public class BpmnConfiguration {

    @Bean
    @Order(value = 0)
    public FilterRegistrationBean<CorsFilter> processCorsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);

        return new FilterRegistrationBean<>(new CorsFilter(source));
    }

    @Bean
    public DeleteDbDelegate deleteDbDelegate() {
        return new DeleteDbDelegate();
    }

    @Bean
    public ClearGeoserverDelegate clearGeoserverDelegate() {
        return new ClearGeoserverDelegate();
    }

    @Bean
    public CheckResultDelegate checkResultDelegate() {
        return new CheckResultDelegate();
    }

    @Bean
    public SendEventDelegate sendEventDelegate() {
        return new SendEventDelegate();
    }

}
