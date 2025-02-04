package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ru.mycrg.data_service.service.resources.protectors.DatasetProtector;
import ru.mycrg.data_service.service.resources.ResourcesInterceptor;
import ru.mycrg.data_service.service.resources.protectors.TableProtector;

@Configuration
public class InterceptorsConfigurer implements WebMvcConfigurer {

    private final TableProtector tableProtector;
    private final DatasetProtector datasetProtector;

    public InterceptorsConfigurer(TableProtector tableProtector,
                                  DatasetProtector datasetProtector) {
        this.tableProtector = tableProtector;
        this.datasetProtector = datasetProtector;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ResourcesInterceptor(datasetProtector, tableProtector));
    }
}
