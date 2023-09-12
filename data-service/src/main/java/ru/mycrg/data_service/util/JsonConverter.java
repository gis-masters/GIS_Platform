package ru.mycrg.data_service.util;

import com.fasterxml.jackson.core.JsonProcessingException;
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
import java.util.Optional;

public class JsonConverter {

    private JsonConverter() {
        throw new IllegalStateException("Utility class");
    }

    private static final Logger log = LoggerFactory.getLogger(JsonConverter.class);

    public static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .setDateFormat(new SimpleDateFormat("dd-MM-yyyy HH:mm"));

    public static JsonNode toJsonNode(Object object) {
        if (object == null) {
            log.warn("toJsonNode input object is 'null'");

            return JacksonUtil.toJsonNode("");
        }

        String jsonString = null;
        try {
            jsonString = getJsonString(object);

            return JacksonUtil.toJsonNode(jsonString);
        } catch (JsonProcessingException e) {
            log.error("Failed convert object: '{}' to jsonNode. Reason: {}", jsonString, e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }

    public static JsonNode toJsonNodeFromString(String json) {
        try {
            return mapper.readTree(json);
        } catch (IOException e) {
            log.error("Failed convert to toJsonNodeFromString: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }

    public static <T> Optional<T> fromJson(String stringJson, Class<T> classOfT) {
        try {
            return Optional.of(mapper.readValue(stringJson, classOfT));
        } catch (IOException e) {
            log.error("Failed convert from string to JSON: {}", e.getMessage());

            return Optional.of(null);
        }
    }

    @Nullable
    public static String getJsonString(Object value) throws JsonProcessingException {
        return mapper.writer()
                     .withDefaultPrettyPrinter()
                     .writeValueAsString(value);
    }

    @NotNull
    public static String asJsonString(Object value) {
        try {
            return mapper.writer()
                         .withDefaultPrettyPrinter()
                         .writeValueAsString(value);
        } catch (Exception e) {
            log.error("Не удалось конвертировать объект: [{}] в JSON строку", value);

            return "FAIL";
        }
    }
}
