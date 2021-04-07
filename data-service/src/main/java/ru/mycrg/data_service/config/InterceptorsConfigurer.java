package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.data_service.service.resources.ResourcesInterceptor;

@Configuration
public class InterceptorsConfigurer implements WebMvcConfigurer {

    private final ResourceProtector resourceProtector;

    public InterceptorsConfigurer(ResourceProtector resourceProtector) {
        this.resourceProtector = resourceProtector;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ResourcesInterceptor(resourceProtector));
    }
}
