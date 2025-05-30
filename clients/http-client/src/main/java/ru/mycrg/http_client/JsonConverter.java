package ru.mycrg.http_client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Optional;

public class JsonConverter {

    private static final Logger log = LoggerFactory.getLogger(JsonConverter.class);

    private static final ObjectMapper mapper =
            new ObjectMapper()
                    .registerModule(new JavaTimeModule())
                    .setDateFormat(new SimpleDateFormat("dd-MM-yyyy HH:mm"));

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

    public static String prettyPrint(Object object) {
        try {
            return mapper.writerWithDefaultPrettyPrinter()
                         .writeValueAsString(object);
        } catch (JsonProcessingException e) {
            return toJson(object);
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

    public static <T> Optional<T> fromBytes(byte[] data, Class<T> clazz) {
        try {
            return Optional.ofNullable(mapper.readValue(data, clazz));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
