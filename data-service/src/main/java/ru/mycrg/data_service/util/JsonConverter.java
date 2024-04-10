package ru.mycrg.data_service.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class JsonConverter {

    private JsonConverter() {
        throw new IllegalStateException("Utility class");
    }

    private static final Logger log = LoggerFactory.getLogger(JsonConverter.class);

    public static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .setDateFormat(new SimpleDateFormat("dd-MM-yyyy HH:mm"));

    @NotNull
    public static JsonNode toJsonNode(@Nullable Object object) {
        if (object == null) {
            return JacksonUtil.toJsonNode("{}");
        }

        String jsonString = null;
        try {
            jsonString = getJsonString(object);

            return JacksonUtil.toJsonNode(jsonString);
        } catch (JsonProcessingException e) {
            log.warn("Failed convert object: '{}' to jsonNode. Reason: {}", jsonString, e.getMessage());

            return JacksonUtil.toJsonNode("{}");
        }
    }

    @NotNull
    public static JsonNode toJsonNodeFromString(String json) {
        try {
            return mapper.readTree(json);
        } catch (IOException e) {
            log.error("Failed convert to toJsonNodeFromString: {}", e.getMessage());

            return JacksonUtil.toJsonNode("{}");
        }
    }

    public static <T> Optional<T> fromJson(String stringJson, TypeReference valueTypeRef) {
        try {
            return Optional.of(mapper.readValue(stringJson, valueTypeRef));
        } catch (IOException e) {
            log.error("Failed convert from string(as type) to JSON: {}", e.getMessage());

            return Optional.empty();
        }
    }

    public static <T> Optional<T> fromJson(String stringJson, Class<T> classOfT) {
        try {
            return Optional.of(mapper.readValue(stringJson, classOfT));
        } catch (IOException e) {
            log.error("Failed convert from string(as class) to JSON: {}", e.getMessage());

            return Optional.empty();
        }
    }

    @Nullable
    public static String getJsonString(Object value) throws JsonProcessingException {
        return mapper.writer()
                     .withDefaultPrettyPrinter()
                     .writeValueAsString(value);
    }

    // TODO: Это тоже самое что и getJsonString только с "FAIL"
    @NotNull
    public static String asJsonString(Object value) {
        try {
            String result = getJsonString(value);

            return result == null ? "FAIL" : result;
        } catch (Exception e) {
            log.error("Не удалось конвертировать объект: [{}] в JSON строку", value);

            return "FAIL";
        }
    }

    public static <T> T fromKeyValueMap(Map<String, Object> value, Class<T> tClass) {
        try {
            return mapper.convertValue(value, tClass);
        } catch (Exception e) {
            log.error("Не удалось конвертировать мапу: [{}] в объект", value);

            return null;
        }
    }

    @NotNull
    public static Map<String, Object> asKeyValueMap(Object value) {
        try {
            return mapper.convertValue(value, new TypeReference<Map<String, Object>>() {
            });
        } catch (Exception e) {
            log.error("Не удалось конвертировать объект: [{}] в мапу", value);

            return new HashMap<>();
        }
    }
}
