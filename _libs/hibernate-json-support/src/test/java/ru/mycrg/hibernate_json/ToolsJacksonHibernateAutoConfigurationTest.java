package ru.mycrg.hibernate_json;

import org.hibernate.cfg.MappingSettings;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ToolsJacksonHibernateAutoConfigurationTest {

    private final ToolsJacksonHibernateAutoConfiguration configuration = new ToolsJacksonHibernateAutoConfiguration();

    @Test
    void shouldSetJsonFormatMapperWhenMissing() {
        Map<String, Object> properties = new HashMap<>();

        configuration.toolsJacksonJsonFormatMapperCustomizer()
                     .customize(properties);

        assertEquals(ToolsJacksonJsonFormatMapper.class.getName(), properties.get(MappingSettings.JSON_FORMAT_MAPPER));
    }

    @Test
    void shouldNotOverrideExistingJsonFormatMapper() {
        Map<String, Object> properties = new HashMap<>();
        properties.put(MappingSettings.JSON_FORMAT_MAPPER, "custom.mapper");

        configuration.toolsJacksonJsonFormatMapperCustomizer()
                     .customize(properties);

        assertEquals("custom.mapper", properties.get(MappingSettings.JSON_FORMAT_MAPPER));
    }
}
