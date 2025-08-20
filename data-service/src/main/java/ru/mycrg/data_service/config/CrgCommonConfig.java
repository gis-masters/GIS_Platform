package ru.mycrg.data_service.config;

import okhttp3.MediaType;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.common_utils.ScriptCalculator;

import java.util.Objects;

import static org.springframework.amqp.core.MessageProperties.CONTENT_TYPE_JSON;

@Configuration
public class CrgCommonConfig {

    public static final Long SYSTEM_USER_ID = -1L;

    /**
     * EPSG:4326. Degree.
     * <br><br>
     * WGS 84 - World Geodetic System 1984
     */
    public static final String DEFAULT_SRID_DEGREE = "4326";
    public static final String DEFAULT_EPSG_DEGREE = "EPSG:4326";

    /**
     * EPSG:3857. Metre.
     * <br><br>
     * WGS 84 - World Geodetic System 1984
     */
    public static final String DEFAULT_SRID_METRE = "3857";
    public static final String DEFAULT_EPSG_METRE = "EPSG:3857";

    public static final String ROOT_FOLDER_PATH = "/root";

    public static final String SYSTEM_DATE_PATTERN = "yyyy-MM-dd";

    public static final String SYSTEM_DATETIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

    public static final String DEFAULT_CONTENT_TYPE = CONTENT_TYPE_JSON;

    @NotNull
    public static final MediaType DEFAULT_MEDIA_TYPE = Objects.requireNonNull(MediaType.parse(DEFAULT_CONTENT_TYPE));

    @Bean
    public CrgScriptEngine crgScriptEngine() {
        return new CrgScriptEngine();
    }

    @Bean
    public ScriptCalculator scriptCalculator() {
        return new ScriptCalculator(crgScriptEngine());
    }
}
