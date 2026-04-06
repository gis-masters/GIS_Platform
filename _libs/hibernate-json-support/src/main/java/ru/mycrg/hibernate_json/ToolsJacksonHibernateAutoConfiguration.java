package ru.mycrg.hibernate_json;

import org.hibernate.cfg.MappingSettings;
import org.hibernate.type.format.AbstractJsonFormatMapper;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.hibernate.autoconfigure.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnClass({ AbstractJsonFormatMapper.class, HibernatePropertiesCustomizer.class })
public class ToolsJacksonHibernateAutoConfiguration {

    @Bean
    HibernatePropertiesCustomizer toolsJacksonJsonFormatMapperCustomizer() {
        return properties -> properties.putIfAbsent(MappingSettings.JSON_FORMAT_MAPPER,
                                                    ToolsJacksonJsonFormatMapper.class.getName());
    }
}
