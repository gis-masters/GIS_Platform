package ru.mycrg.acceptance;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

public class JsonMapper {

    private static final ObjectWriter writer;
    private static final ObjectMapper mapper = new ObjectMapper();

    static {
        writer = mapper.writer()
                       .withDefaultPrettyPrinter();
    }

    public static String asJson(Object value) {
        try {
            return writer.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public static JsonNode asJsonNode(String jsonString) {
        JsonNode jsonNode = null;

        try {
            jsonNode = mapper.readValue(jsonString, JsonNode.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return jsonNode;
    }
}
