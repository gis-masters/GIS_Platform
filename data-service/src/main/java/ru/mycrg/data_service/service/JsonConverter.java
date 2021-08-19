package ru.mycrg.data_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class JsonConverter {

    private JsonConverter() {
        throw new IllegalStateException("Utility class");
    }

    private static final Logger log = LoggerFactory.getLogger(JsonConverter.class);

    public static final ObjectMapper mapper = new ObjectMapper();

    public static JsonNode toJsonNode(Object object) {
        try {
            return JacksonUtil.toJsonNode(getJsonString(object));
        } catch (JsonProcessingException e) {
            log.error("Failed convert to jsonNode: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }

    @Nullable
    private static String getJsonString(Object value) throws JsonProcessingException {
        return mapper.writer()
                     .withDefaultPrettyPrinter()
                     .writeValueAsString(value);
    }

    public static JsonNode toJsonNodeFromString(String json) {
        try {
            return mapper.readTree(json);
        } catch (IOException e) {
            log.error("Failed convert to jsonNode: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }
}
