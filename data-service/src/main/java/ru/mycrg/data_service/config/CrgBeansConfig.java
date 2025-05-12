package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.common_utils.CrgScriptEngine;

@Configuration
public class CrgBeansConfig {

    @Bean
    public CrgScriptEngine crgScriptEngine() {
        return new CrgScriptEngine();
    }
}
