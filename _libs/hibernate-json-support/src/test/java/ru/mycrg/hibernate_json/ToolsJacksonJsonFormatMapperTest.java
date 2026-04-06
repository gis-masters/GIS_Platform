package ru.mycrg.hibernate_json;

import org.junit.jupiter.api.Test;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ToolsJacksonJsonFormatMapperTest {

    private final ToolsJacksonJsonFormatMapper mapper = new ToolsJacksonJsonFormatMapper();
    private final JsonMapper objectMapper = JsonMapper.builder().build();

    @Test
    void shouldRoundTripJsonNode() throws Exception {
        JsonNode expected = objectMapper.readTree("""
                {
                  "enabled": true,
                  "layers": [
                    "base",
                    "cadastre"
                  ]
                }
                """);

        String serialized = mapper.toString(expected, JsonNode.class);
        JsonNode actual = mapper.fromString(serialized, JsonNode.class);

        assertEquals(expected, actual);
    }
}
