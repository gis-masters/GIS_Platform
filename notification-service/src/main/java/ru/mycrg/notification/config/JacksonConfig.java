package ru.mycrg.notification.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.cfg.DateTimeFeature;
import tools.jackson.databind.json.JsonMapper;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public JsonMapper objectMapper() {
        return JsonMapper.builder()
                         .changeDefaultPropertyInclusion(incl ->
                                                                 incl.withValueInclusion(JsonInclude.Include.NON_NULL))
                         .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                         .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
                         .findAndAddModules()
                         .build();
    }
}
