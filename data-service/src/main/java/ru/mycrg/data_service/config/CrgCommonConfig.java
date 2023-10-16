package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.common_utils.ScriptCalculator;

import java.time.ZoneId;

@Configuration
public class CrgCommonConfig {

    public static final String ROOT_FOLDER_PATH = "/root";

    public static final String SYSTEM_DATE_PATTERN = "yyyy-MM-dd";

    public static final String SYSTEM_DATETIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

    @Bean
    public CrgScriptEngine crgScriptEngine() {
        return new CrgScriptEngine();
    }

    @Bean
    public ScriptCalculator scriptCalculator() {
        return new ScriptCalculator(crgScriptEngine());
    }
}
