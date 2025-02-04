package ru.mycrg.wrapper.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.common_utils.ScriptCalculator;

@Configuration
public class CrgBeansConfig {
    @Bean
    public CrgScriptEngine crgScriptEngine() {
        return new CrgScriptEngine();
    }

    @Bean
    public ScriptCalculator scriptCalculator() {
        return new ScriptCalculator(crgScriptEngine());
    }
}
