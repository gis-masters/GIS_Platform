package ru.mycrg.gis.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JsonConverter {

    private static Logger log = LoggerFactory.getLogger(JsonConverter.class);

    private static ObjectMapper mapper = new ObjectMapper();

    public static JsonNode toJsonNode(Object object) {
        try {
            return JacksonUtil.toJsonNode(getJsonString(object));
        } catch (JsonProcessingException e) {
            log.error("Failed convert to jsonNode: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }

    @Nullable
    static private String getJsonString(Object classType) throws JsonProcessingException {
        return mapper.writer()
                .withDefaultPrettyPrinter()
                .writeValueAsString(classType);
    }

}
