package ru.mycrg.acceptance;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import java.util.Map;

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
            System.out.println("Не удалось преобразовать к JsonNode => " + e.getMessage());
        }

        return jsonNode;
    }

    public static Map<String, Object> getMapFromJsonString(String jsonString) throws JsonProcessingException {
        return mapper.readValue(normalizeJsonString(jsonString),
                                new TypeReference<>() {
                                });
    }

    /**
     * Нормализует JSON строку: убирает переносы строк внутри строковых значений (заменяет на пробелы). Это нужно, чтобы
     * убрать форматирование из feature файла.
     */
    private static String normalizeJsonString(String json) {
        StringBuilder result = new StringBuilder();
        boolean insideString = false;
        boolean escaped = false;

        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);

            if (escaped) {
                result.append(c);
                escaped = false;
                continue;
            }

            if (c == '\\') {
                escaped = true;
                result.append(c);
                continue;
            }

            if (c == '"') {
                insideString = !insideString;
                result.append(c);
                continue;
            }

            if (insideString && (c == '\n' || c == '\r')) {
                if (c == '\r' && i + 1 < json.length() && json.charAt(i + 1) == '\n') {
                    i++;
                }

                if (result.length() > 0 && result.charAt(result.length() - 1) != ' ') {
                    result.append(' ');
                }
            } else {
                result.append(c);
            }
        }

        return normalizeSpaces(result.toString());
    }

    /**
     * Убирает множественные пробелы подряд внутри строковых значений JSON.
     */
    private static String normalizeSpaces(String json) {
        StringBuilder result = new StringBuilder();
        boolean insideString = false;
        boolean escaped = false;
        boolean lastWasSpace = false;

        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);

            if (escaped) {
                result.append(c);
                escaped = false;
                continue;
            }

            if (c == '\\') {
                escaped = true;
                result.append(c);
                lastWasSpace = false;
                continue;
            }

            if (c == '"') {
                insideString = !insideString;
                result.append(c);
                lastWasSpace = false;
                continue;
            }

            if (insideString && c == ' ') {
                if (!lastWasSpace) {
                    result.append(' ');
                }
                lastWasSpace = true;
            } else {
                result.append(c);
                lastWasSpace = false;
            }
        }

        return result.toString();
    }
}
