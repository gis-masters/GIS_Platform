package ru.mycrg.http_client;

import jakarta.json.Json;
import jakarta.json.JsonReader;
import jakarta.json.JsonValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

import java.io.File;
import java.io.InputStream;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.Optional;

public class JsonConverter {

    private static final Logger log = LoggerFactory.getLogger(JsonConverter.class);

    //TODO проверить на имутабельность
    private static final ObjectMapper mapper = JsonMapper.builder()
                                                         .defaultDateFormat(new SimpleDateFormat("dd-MM-yyyy HH:mm"))
                                                         .build();

    private JsonConverter() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Serialize any Java value as a String.
     */
    public static String toJson(Object value) {
        try {
            return mapper.writer()
                         .writeValueAsString(value);
        } catch (Exception e) {
            throw new IllegalArgumentException("Не удалось обработать объект: " + value);
        }
    }

    public static JsonNode toJsonNode(@Nullable Object value) {
        try {
            return mapper.convertValue(value, JsonNode.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Не удалось конвертировать объект в JsonNode: " + value);
        }
    }

    @NotNull
    public static JsonNode toJsonNodeSafe(@Nullable Object object) {
        if (object == null) {
            return mapper.nullNode();
        }

        String jsonString = null;
        try {
            jsonString = getJsonString(object);

            return mapper.convertValue(object, JsonNode.class);
        } catch (Exception e) {
            log.warn("Сбой при конвертации объекта: '{}' в jsonNode. Причина: {}", jsonString, e.getMessage());

            return mapper.nullNode();
        }
    }

    public static JsonNode toJsonNodeFromString(String json) {
        try {
            return mapper.readTree(json);
        } catch (Exception e) {
            log.error("Сбой при конвертации в toJsonNodeFromString: {}", e.getMessage(), e);

            return mapper.createObjectNode();
        }
    }

    public static JsonNode toJsonNode(@Nullable JsonValue value) {
        if (value == null || value == JsonValue.NULL) {
            return mapper.nullNode();
        }

        try {
            return mapper.readTree(value.toString());
        } catch (Exception e) {
            throw new IllegalArgumentException("Не удалось конвертировать JsonValue в JsonNode", e);
        }
    }

    public static String prettyPrint(Object object) {
        try {
            return mapper.writerWithDefaultPrettyPrinter()
                         .writeValueAsString(object);
        } catch (JacksonException e) {
            return toJson(object);
        }
    }

    public static String getJsonString(Object value) {
        return mapper.writer()
                     .withDefaultPrettyPrinter()
                     .writeValueAsString(value);
    }

    public static String asJsonString(Object value) {
        try {
            String result = getJsonString(value);

            return result == null ? "FAIL" : result;
        } catch (Exception e) {
            log.error("Не удалось конвертировать объект: [{}] в JSON строку", value, e);

            return "FAIL";
        }
    }

    public static <T> Optional<T> fromJson(String stringJson, Class<T> classOfT) {
        try {
            return Optional.ofNullable(mapper.readValue(stringJson, classOfT));
        } catch (Exception e) {
            log.error("Сбой при конвертации строки: [{}] в класс: [{}] в JSON: {}",
                      stringJson, classOfT.getSimpleName(), e.getMessage(), e);

            return Optional.empty();
        }
    }

    public static <T> Optional<T> fromJson(String stringJson, TypeReference<T> typeReference) {
        try {
            return Optional.ofNullable(mapper.readValue(stringJson, typeReference));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public static <T> Optional<T> fromJson(InputStream inputStream, TypeReference<T> typeReference) {
        try (InputStream is = inputStream) {
            return Optional.ofNullable(mapper.readValue(is, typeReference));
        } catch (Exception e) {
            log.error("Сбой при конвертации InputStream с TypeReference в JSON: {}", e.getMessage(), e);

            return Optional.empty();
        }
    }

    public static <T> Optional<T> fromBytes(byte[] data, Class<T> clazz) {
        try {
            return Optional.ofNullable(mapper.readValue(data, clazz));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public static <T> T convertValue(Object fromValue, TypeReference<T> typeReference) {
        try {
            return mapper.convertValue(fromValue, typeReference);
        } catch (Exception e) {
            log.error("Сбой при конвертации объекта: [{}] с TypeReference: {}",
                      fromValue, e.getMessage(), e);

            throw new IllegalArgumentException("Не удалось конвертировать объект", e);
        }
    }

    public static JsonValue toJsonValue(@Nullable JsonNode node) {
        if (node == null || node.isNull()) {
            return JsonValue.NULL;
        }

        try (JsonReader reader = Json.createReader(new StringReader(mapper.writeValueAsString(node)))) {
            return reader.readValue();
        } catch (Exception e) {
            throw new IllegalArgumentException("Не удалось конвертировать JsonNode в JsonValue", e);
        }
    }

    public static JsonNode readTreeFromFile(File file) {
        return mapper.readTree(file);
    }
}
